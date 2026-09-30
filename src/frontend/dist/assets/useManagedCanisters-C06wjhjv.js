var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _result, _queries, _options, _observers, _combinedResult, _lastCombine, _lastResult, _lastQueryHashes, _observerMatches, _QueriesObserver_instances, trackResult_fn, combineResult_fn, findMatchingObservers_fn, onUpdate_fn, notify_fn, _a;
import { Q as QueryObserver, u as useIsRestoring, k as useQueryErrorResetBoundary, l as ensureSuspenseTimers, m as ensurePreventErrorBoundaryRetry, n as useClearResetErrorBoundary, s as shouldSuspend, o as fetchOptimistic, p as getHasError, q as useBackend, r as useQuery, v as useMutation } from "./formatCycles-BoTNfZET.js";
import { h as Subscribable, n as notifyManager, s as shallowEqualObjects, i as replaceEqualDeep, u as useQueryClient, r as reactExports, k as noop } from "./index-CgHyeyef.js";
function difference(array1, array2) {
  const excludeSet = new Set(array2);
  return array1.filter((x) => !excludeSet.has(x));
}
function replaceAt(array, index, value) {
  const copy = array.slice(0);
  copy[index] = value;
  return copy;
}
var QueriesObserver = (_a = class extends Subscribable {
  constructor(client, queries, options) {
    super();
    __privateAdd(this, _QueriesObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _result);
    __privateAdd(this, _queries);
    __privateAdd(this, _options);
    __privateAdd(this, _observers);
    __privateAdd(this, _combinedResult);
    __privateAdd(this, _lastCombine);
    __privateAdd(this, _lastResult);
    __privateAdd(this, _lastQueryHashes);
    __privateAdd(this, _observerMatches, []);
    __privateSet(this, _client, client);
    __privateSet(this, _options, options);
    __privateSet(this, _queries, []);
    __privateSet(this, _observers, []);
    __privateSet(this, _result, []);
    this.setQueries(queries);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _observers).forEach((observer) => {
        observer.subscribe((result) => {
          __privateMethod(this, _QueriesObserver_instances, onUpdate_fn).call(this, observer, result);
        });
      });
    }
  }
  onUnsubscribe() {
    if (!this.listeners.size) {
      this.destroy();
    }
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateGet(this, _observers).forEach((observer) => {
      observer.destroy();
    });
  }
  setQueries(queries, options) {
    __privateSet(this, _queries, queries);
    __privateSet(this, _options, options);
    notifyManager.batch(() => {
      const prevObservers = __privateGet(this, _observers);
      const newObserverMatches = __privateMethod(this, _QueriesObserver_instances, findMatchingObservers_fn).call(this, __privateGet(this, _queries));
      newObserverMatches.forEach(
        (match) => match.observer.setOptions(match.defaultedQueryOptions)
      );
      const newObservers = newObserverMatches.map((match) => match.observer);
      const newResult = newObservers.map(
        (observer) => observer.getCurrentResult()
      );
      const hasLengthChange = prevObservers.length !== newObservers.length;
      const hasIndexChange = newObservers.some(
        (observer, index) => observer !== prevObservers[index]
      );
      const hasStructuralChange = hasLengthChange || hasIndexChange;
      const hasResultChange = hasStructuralChange ? true : newResult.some((result, index) => {
        const prev = __privateGet(this, _result)[index];
        return !prev || !shallowEqualObjects(result, prev);
      });
      if (!hasStructuralChange && !hasResultChange) return;
      if (hasStructuralChange) {
        __privateSet(this, _observerMatches, newObserverMatches);
        __privateSet(this, _observers, newObservers);
      }
      __privateSet(this, _result, newResult);
      if (!this.hasListeners()) return;
      if (hasStructuralChange) {
        difference(prevObservers, newObservers).forEach((observer) => {
          observer.destroy();
        });
        difference(newObservers, prevObservers).forEach((observer) => {
          observer.subscribe((result) => {
            __privateMethod(this, _QueriesObserver_instances, onUpdate_fn).call(this, observer, result);
          });
        });
      }
      __privateMethod(this, _QueriesObserver_instances, notify_fn).call(this);
    });
  }
  getCurrentResult() {
    return __privateGet(this, _result);
  }
  getQueries() {
    return __privateGet(this, _observers).map((observer) => observer.getCurrentQuery());
  }
  getObservers() {
    return __privateGet(this, _observers);
  }
  getOptimisticResult(queries, combine) {
    const matches = __privateMethod(this, _QueriesObserver_instances, findMatchingObservers_fn).call(this, queries);
    const result = matches.map(
      (match) => match.observer.getOptimisticResult(match.defaultedQueryOptions)
    );
    const queryHashes = matches.map(
      (match) => match.defaultedQueryOptions.queryHash
    );
    return [
      result,
      (r) => {
        return __privateMethod(this, _QueriesObserver_instances, combineResult_fn).call(this, r ?? result, combine, queryHashes);
      },
      () => {
        return __privateMethod(this, _QueriesObserver_instances, trackResult_fn).call(this, result, matches);
      }
    ];
  }
}, _client = new WeakMap(), _result = new WeakMap(), _queries = new WeakMap(), _options = new WeakMap(), _observers = new WeakMap(), _combinedResult = new WeakMap(), _lastCombine = new WeakMap(), _lastResult = new WeakMap(), _lastQueryHashes = new WeakMap(), _observerMatches = new WeakMap(), _QueriesObserver_instances = new WeakSet(), trackResult_fn = function(result, matches) {
  return matches.map((match, index) => {
    const observerResult = result[index];
    return !match.defaultedQueryOptions.notifyOnChangeProps ? match.observer.trackResult(observerResult, (accessedProp) => {
      matches.forEach((m) => {
        m.observer.trackProp(accessedProp);
      });
    }) : observerResult;
  });
}, combineResult_fn = function(input, combine, queryHashes) {
  if (combine) {
    const lastHashes = __privateGet(this, _lastQueryHashes);
    const queryHashesChanged = queryHashes !== void 0 && lastHashes !== void 0 && (lastHashes.length !== queryHashes.length || queryHashes.some((hash, i) => hash !== lastHashes[i]));
    if (!__privateGet(this, _combinedResult) || __privateGet(this, _result) !== __privateGet(this, _lastResult) || queryHashesChanged || combine !== __privateGet(this, _lastCombine)) {
      __privateSet(this, _lastCombine, combine);
      __privateSet(this, _lastResult, __privateGet(this, _result));
      if (queryHashes !== void 0) {
        __privateSet(this, _lastQueryHashes, queryHashes);
      }
      __privateSet(this, _combinedResult, replaceEqualDeep(
        __privateGet(this, _combinedResult),
        combine(input)
      ));
    }
    return __privateGet(this, _combinedResult);
  }
  return input;
}, findMatchingObservers_fn = function(queries) {
  const prevObserversMap = /* @__PURE__ */ new Map();
  __privateGet(this, _observers).forEach((observer) => {
    const key = observer.options.queryHash;
    if (!key) return;
    const previousObservers = prevObserversMap.get(key);
    if (previousObservers) {
      previousObservers.push(observer);
    } else {
      prevObserversMap.set(key, [observer]);
    }
  });
  const observers = [];
  queries.forEach((options) => {
    var _a2;
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const match = (_a2 = prevObserversMap.get(defaultedOptions.queryHash)) == null ? void 0 : _a2.shift();
    const observer = match ?? new QueryObserver(__privateGet(this, _client), defaultedOptions);
    observers.push({
      defaultedQueryOptions: defaultedOptions,
      observer
    });
  });
  return observers;
}, onUpdate_fn = function(observer, result) {
  const index = __privateGet(this, _observers).indexOf(observer);
  if (index !== -1) {
    __privateSet(this, _result, replaceAt(__privateGet(this, _result), index, result));
    __privateMethod(this, _QueriesObserver_instances, notify_fn).call(this);
  }
}, notify_fn = function() {
  var _a2;
  if (this.hasListeners()) {
    const previousResult = __privateGet(this, _combinedResult);
    const newTracked = __privateMethod(this, _QueriesObserver_instances, trackResult_fn).call(this, __privateGet(this, _result), __privateGet(this, _observerMatches));
    const newResult = __privateMethod(this, _QueriesObserver_instances, combineResult_fn).call(this, newTracked, (_a2 = __privateGet(this, _options)) == null ? void 0 : _a2.combine);
    if (previousResult !== newResult) {
      notifyManager.batch(() => {
        this.listeners.forEach((listener) => {
          listener(__privateGet(this, _result));
        });
      });
    }
  }
}, _a);
function useQueries({
  queries,
  ...options
}, queryClient) {
  const client = useQueryClient();
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const defaultedQueries = reactExports.useMemo(
    () => queries.map((opts) => {
      const defaultedOptions = client.defaultQueryOptions(
        opts
      );
      defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
      return defaultedOptions;
    }),
    [queries, client, isRestoring]
  );
  defaultedQueries.forEach((queryOptions) => {
    ensureSuspenseTimers(queryOptions);
    const query = client.getQueryCache().get(queryOptions.queryHash);
    ensurePreventErrorBoundaryRetry(queryOptions, errorResetBoundary, query);
  });
  useClearResetErrorBoundary(errorResetBoundary);
  const [observer] = reactExports.useState(
    () => new QueriesObserver(
      client,
      defaultedQueries,
      options
    )
  );
  const [optimisticResult, getCombinedResult, trackResult] = observer.getOptimisticResult(
    defaultedQueries,
    options.combine
  );
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop,
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setQueries(
      defaultedQueries,
      options
    );
  }, [defaultedQueries, options, observer]);
  const shouldAtLeastOneSuspend = optimisticResult.some(
    (result, index) => shouldSuspend(defaultedQueries[index], result)
  );
  const suspensePromises = shouldAtLeastOneSuspend ? optimisticResult.flatMap((result, index) => {
    const opts = defaultedQueries[index];
    if (opts && shouldSuspend(opts, result)) {
      const queryObserver = new QueryObserver(client, opts);
      return fetchOptimistic(opts, queryObserver, errorResetBoundary);
    }
    return [];
  }) : [];
  if (suspensePromises.length > 0) {
    throw Promise.all(suspensePromises);
  }
  const firstSingleResultWhichShouldThrow = optimisticResult.find(
    (result, index) => {
      const query = defaultedQueries[index];
      return query && getHasError({
        result,
        errorResetBoundary,
        throwOnError: query.throwOnError,
        query: client.getQueryCache().get(query.queryHash),
        suspense: query.suspense
      });
    }
  );
  if (firstSingleResultWhichShouldThrow == null ? void 0 : firstSingleResultWhichShouldThrow.error) {
    throw firstSingleResultWhichShouldThrow.error;
  }
  return getCombinedResult(trackResult());
}
function useActiveCanister(autoRefresh = true) {
  const { actor, isAuthenticated, isLoading } = useBackend();
  return useQuery({
    queryKey: ["activeCanister"],
    queryFn: async () => {
      if (!actor) return null;
      const principal = await actor.getActiveCanister();
      return principal ? principal.toText() : null;
    },
    enabled: isAuthenticated && !isLoading && !!actor,
    refetchInterval: autoRefresh ? 6e4 : false,
    staleTime: 0,
    refetchOnMount: true
  });
}
function useSetActiveCanister() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (canisterId) => {
      if (!actor) throw new Error("Backend is not ready");
      await actor.setActiveCanister(canisterId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["activeCanister"] });
    }
  });
}
const STORAGE_KEY = "autoRefresh";
function getInitialAutoRefresh() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "false") return false;
  return true;
}
function useAutoRefresh() {
  const [autoRefresh, setAutoRefresh] = reactExports.useState(
    getInitialAutoRefresh
  );
  const toggleAutoRefresh = reactExports.useCallback(() => {
    setAutoRefresh((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);
  return { autoRefresh, toggleAutoRefresh };
}
function toStatusKind(status) {
  switch (status.__kind__) {
    case "running":
      return { kind: "running", detail: null };
    case "stopping":
      return { kind: "stopping", detail: null };
    case "stopped":
      return { kind: "stopped", detail: null };
    case "unknown":
      return { kind: "unknown", detail: status.unknown };
  }
}
function useCanisterOverviews(canisters, autoRefresh = true) {
  const { actor, isAuthenticated, isLoading } = useBackend();
  const enabled = isAuthenticated && !isLoading && !!actor;
  const list = canisters ?? [];
  const results = useQueries({
    queries: list.map((canister) => {
      const canisterId = canister.canisterId.toText();
      return {
        queryKey: ["canisterOverview", canisterId],
        queryFn: async () => {
          if (!actor) throw new Error("Backend is not ready");
          const statusResult = await actor.getCanisterStatus(canisterId);
          if (statusResult.__kind__ === "err")
            throw new Error(statusResult.err);
          const info = statusResult.ok;
          const { kind, detail } = toStatusKind(info.status);
          return {
            canisterId,
            addedAt: canister.addedAt,
            status: kind,
            statusDetail: detail,
            controllers: info.controllers,
            cycleBalance: info.resources.cycleBalance,
            burnRateCyclesPerDay: info.resources.burnRateCyclesPerDay,
            runwayDays: info.resources.runwayDays,
            memory: {
              heapBytes: info.resources.memory.heapBytes,
              stableBytes: info.resources.memory.stableBytes,
              wasmBytes: info.resources.memory.wasmBytes
            },
            settings: {
              computeAllocation: info.resources.settings.computeAllocation,
              memoryAllocation: info.resources.settings.memoryAllocation,
              freezingThreshold: info.resources.settings.freezingThreshold
            }
          };
        },
        enabled: enabled && !!canisterId,
        refetchInterval: autoRefresh ? 3e4 : false,
        staleTime: 15e3,
        retry: 1
      };
    })
  });
  const overviews = [];
  let isAnyLoading = false;
  let firstError = null;
  for (const result of results) {
    if (result.isLoading) isAnyLoading = true;
    if (result.error && !firstError) firstError = result.error;
    if (result.data) overviews.push(result.data);
  }
  return {
    overviews,
    isLoading: isAnyLoading,
    error: firstError,
    refetchAll: () => {
      for (const result of results) void result.refetch();
    }
  };
}
function useManagedCanisters(autoRefresh = true) {
  const { actor, isAuthenticated, isLoading } = useBackend();
  return useQuery({
    queryKey: ["managedCanisters"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listManagedCanisters();
    },
    enabled: isAuthenticated && !isLoading && !!actor,
    refetchInterval: autoRefresh ? 6e4 : false,
    staleTime: 0,
    refetchOnMount: true
  });
}
function useAddCanister() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (canisterId) => {
      if (!actor) throw new Error("Backend is not ready");
      await actor.addCanister(canisterId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["managedCanisters"] });
      void queryClient.invalidateQueries({ queryKey: ["activeCanister"] });
    }
  });
}
function useRemoveCanister() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (canisterId) => {
      if (!actor) throw new Error("Backend is not ready");
      await actor.removeCanister(canisterId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["managedCanisters"] });
      void queryClient.invalidateQueries({ queryKey: ["activeCanister"] });
      void queryClient.invalidateQueries({ queryKey: ["canisterResources"] });
    }
  });
}
export {
  useManagedCanisters as a,
  useActiveCanister as b,
  useSetActiveCanister as c,
  useRemoveCanister as d,
  useCanisterOverviews as e,
  useAddCanister as f,
  useAutoRefresh as u
};
