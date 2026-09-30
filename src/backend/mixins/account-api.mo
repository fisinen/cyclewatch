import Common "../types/common";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

mixin (caffeineAccounts : Map.Map<Common.UserId, Text>) {

  // Save the caller's Caffeine AI account ID.
  // Rejects if the accountId is already linked to a different principal.
  public shared ({ caller }) func setCaffeineAccountId(accountId : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    let trimmed = accountId.trimStart(#char ' ').trimEnd(#char ' ');
    if (trimmed == "") {
      Runtime.trap("Account ID cannot be empty");
    };
    // Check if this accountId is already claimed by a different principal
    let existingOwner = caffeineAccounts.entries().find(
      func((_, id)) { id == trimmed }
    );
    switch (existingOwner) {
      case (?(owner, _)) {
        if (not Principal.equal(owner, caller)) {
          Runtime.trap("This account ID is already linked to a different user");
        };
        // Same caller updating their own link — allow it
      };
      case null {};
    };
    caffeineAccounts.add(caller, trimmed);
  };

  // Get the caller's saved Caffeine AI account ID, or null if not set
  public query ({ caller }) func getCaffeineAccountId() : async ?Text {
    if (caller.isAnonymous()) {
      return null;
    };
    caffeineAccounts.get(caller);
  };

  // Remove the caller's saved Caffeine AI account ID
  public shared ({ caller }) func clearCaffeineAccountId() : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers not allowed");
    };
    caffeineAccounts.remove(caller);
  };
};
