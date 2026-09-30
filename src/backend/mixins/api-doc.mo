mixin () {
  // Static Markdown documentation of this backend's public API. Reads no state.
  public query func getApiDoc() : async Text {
    "
# Canister Management Backend

This backend lets a signed-in user register the canisters they want to manage,
select one as active, and read the compute-resource state of each managed
canister (cycle balance, burn rate, runway, memory breakdown, and settings) from
the Internet Computer management canister. It also tracks the live ICP-to-Cycles
rate sourced from the Cycles Minting Canister (CMC).

## Authentication and identity

Every mutating method and every method that reads a canister's live status
requires a **signed (non-anonymous) caller**. Anonymous callers are rejected:
update methods trap with `Anonymous callers not allowed`, and the read methods
that return a result variant return `#err(\"Anonymous callers not allowed\")`.
`listManagedCanisters` and `getActiveCanister` return an empty list / `null` for
anonymous callers instead of trapping.

There is no separate registration step: a caller's identity is its principal,
and the first call that adds a canister creates that caller's entry. A principal
that has never called `addCanister` simply has no managed canisters.

The app's frontend pins an Internet Identity derivation origin, published at
`/.well-known/ii-derivation-origin` when available. An agent already holding the
user's Internet Identity authorization derives the correct per-app principal
against that origin (for example `icp identity link web <name> --app <host>`).
Such a delegation acts with the user's full authority in this app until it
expires. A signed-in caller derived against a different origin is a different
principal than the one the frontend registered, so it sees a different (likely
empty) managed-canister list.

## Authorization

- A caller may only read the status, resources, or cycle balance of a canister
  that is in **their own** managed list. Otherwise the call returns
  `#err(\"Canister is not in your managed list\")`.
- `setActiveCanister` requires the target canister to already be in the caller's
  managed list; otherwise it traps with
  `Canister is not in your managed list`.
- Reading a canister's live status additionally requires this backend canister to
  be a **controller** of the target canister. If it is not, the call returns
  `#err(\"Not authorized to read this canister's status. Add this backend canister
  as a controller of the target canister.\")`. `getCanisterStatus` falls back to
  `canister_info` in that case, returning `#unknown(...)` status with the
  controller list but zeroed resources.
- The OQL query surface (`schema` / `execute`) is controller-only for every
  entity.

## Methods

### Canister management

- `addCanister(canisterId : Text) : async ()` — add a canister (principal text)
  to the caller's managed list. Upsert: adding an existing canister refreshes its
  `addedAt`. The first canister a caller adds also becomes their active
  selection. Traps on anonymous callers or unparseable principal text.
- `removeCanister(canisterId : Text) : async ()` — remove a canister from the
  caller's managed list. If it was the active selection, the active selection is
  cleared. Traps on anonymous callers.
- `listManagedCanisters() : async [ManagedCanister]` — the caller's managed
  canisters, each `{ canisterId : Principal; addedAt : Int }`. Returns `[]` for
  anonymous callers.
- `setActiveCanister(canisterId : Text) : async ()` — set the caller's active
  canister. The canister must already be managed by the caller. Traps on
  anonymous callers or when the canister is not managed.
- `getActiveCanister() : async ?Principal` — the caller's active canister, or
  `null` if none is set. Returns `null` for anonymous callers.

### Compute resources

- `getCanisterCycleBalance(canisterId : Text) : async { #ok : Nat; #err : Text }`
  — the target canister's current cycle balance in cycles. Requires the canister
  to be managed by the caller and this backend to be a controller of it.
- `getCanisterResources(canisterId : Text) : async { #ok : CanisterResources; #err : Text }`
  — a full compute-resource snapshot: `cycleBalance`, `burnRateCyclesPerDay`,
  `runwayDays`, `memory { heapBytes; stableBytes; wasmBytes }`, and
  `settings { computeAllocation; memoryAllocation; freezingThreshold }`. Each
  successful call records the observed balance, which is what makes the burn rate
  and runway meaningful on subsequent calls.
- `getCanisterStatus(canisterId : Text) : async { #ok : CanisterStatusInfo; #err : Text }`
  — status (`#running` / `#stopped` / `#stopping` / `#unknown : Text`), the
  controller list as text, and a resource snapshot with the same derived burn
  rate and runway as `getCanisterResources`. Falls back to `canister_info`
  when this backend is not a controller, yielding `#unknown(...)` status and
  zeroed resources.

### ICP-to-Cycles rate

- `getIcpToCyclesRate() : async IcpToCyclesRate` — the last stored rate,
  `{ icpPerXdr : Nat; updatedAt : Int }`. Returns the stored value (initially
  `{ icpPerXdr = 0; updatedAt = 0 }`) without contacting the CMC.
- `refreshIcpToCyclesRate() : async IcpToCyclesRate` — fetch the live rate from
  the CMC and store it. Traps on anonymous callers.

### Identity

- `getBackendCanisterId() : async Text` — this backend canister's own principal
  as text, so the frontend can show it in controller-setup instructions.

### Data intelligence (OQL)

- `schema() : async Text` — the OQL schema of the exposed entities.
- `execute(query : Text) : async Text` — run an OQL query against the exposed
  entities. Controller-only.

## Units and encodings

- **Cycles** are `Nat` counts of cycles (1 cycle = 1 unit; 1 trillion cycles =
  `1_000_000_000_000`).
- **Timestamps** are `Int` nanoseconds since the Unix epoch (`Time.now()`).
- **Canister ids** are `Principal` values; the API accepts them as principal
  text and returns them as `Principal`.
- **`icpPerXdr`** is the ICP price of one XDR, scaled by `1_000_000_000`
  (1e9). To get the human-readable ICP-per-XDR value, divide by 1e9:
  `icpPerXdr / 1_000_000_000`. The backend stores and returns this 1e9 scale
  everywhere; it never returns an unscaled or 1e4-scaled value.
  - Formula: `icpPerXdr = 10_000_000_000_000 / xdr_permyriad_per_icp`, where
    `xdr_permyriad_per_icp` is the CMC's XDR-per-10_000-ICP figure. The
    `10_000_000_000_000` factor is `10_000` (permyriad) times `1_000_000_000`
    (the 1e9 scale).
  - Worked example: if the CMC reports `xdr_permyriad_per_icp = 7142`
    (i.e. 0.7142 XDR per ICP), then
    `icpPerXdr = 10_000_000_000_000 / 7142 = 1_400_168_000`, which is
    `1_400_168_000 / 1e9 = 1.400168` ICP per XDR.
  - Cycles per ICP: one XDR is worth 1 trillion cycles, so
    `cyclesPerIcp = 1_000_000_000_000 * 1_000_000_000 / icpPerXdr`. With the
    example above, `1e12 * 1e9 / 1_400_168_000 = 714_200_000_000` cycles per
    ICP (about 0.7142 trillion cycles, i.e. 0.7142 TC per ICP).
- **`burnRateCyclesPerDay`** is cycles burned per day, derived from the change
  between two observed balances; **`runwayDays`** is `cycleBalance / burnRate`.
  Both are `0` until there is usable history (no prior observation, no elapsed
  time, or no decrease in balance). `getCanisterResources` and
  `getCanisterStatus` share the same derivation and record the same
  observation, so both report identical burn rate and runway for a canister.
- **Memory fields** are byte counts: `heapBytes` is the canister's actual heap
  (`memory_size` from `canister_status`), `stableBytes` is
  `stable_memory_size`, and `wasmBytes` is `wasm_binary_size`.

## Lifecycle and polling

- `getCanisterResources` and `getCanisterStatus` are **update** calls (they
  contact the management canister), so they are not free queries. Poll them at a
  modest interval; each `getCanisterResources` call updates the stored
  observation, so polling too frequently yields a noisy burn rate.
- Burn rate and runway only become non-zero after at least two successful
  status/resource reads separated by a balance decrease. Both
  `getCanisterResources` and `getCanisterStatus` record an observation, so
  either can establish the history.
- `getIcpToCyclesRate` is a cheap query over stored state; call
  `refreshIcpToCyclesRate` to update it from the CMC.

## Mutation retry safety

- `addCanister` is idempotent (upsert) — retrying is safe, though it refreshes
  `addedAt`.
- `removeCanister` is idempotent — removing an absent canister is a no-op.
- `setActiveCanister` is idempotent.
- `refreshIcpToCyclesRate` is safe to retry; it overwrites the stored rate.
- `getCanisterResources` and `getCanisterStatus` have a side effect (recording
  an observation) but are safe to retry.

## Errors and gotchas

- Anonymous callers are rejected on all mutating methods and on the
  status/resource reads.
- A canister must be in the caller's managed list before its status can be read.
- This backend must be a controller of a target canister to read its live status;
  otherwise `getCanisterStatus` returns `#unknown(...)` with zeroed resources and
  the other reads return `#err(...)`.
- `addCanister` and `setActiveCanister` trap on unparseable principal text.
- The OQL entities are controller-only; end users cannot read them directly.
";
  };
};
