import { c as createLucideIcon, u as useQueryClient } from "./index-CgHyeyef.js";
import { q as useBackend, r as useQuery, v as useMutation } from "./formatCycles-BoTNfZET.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "20", height: "8", x: "2", y: "2", rx: "2", ry: "2", key: "ngkwjq" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2", ry: "2", key: "iecqi9" }],
  ["line", { x1: "6", x2: "6.01", y1: "6", y2: "6", key: "16zg32" }],
  ["line", { x1: "6", x2: "6.01", y1: "18", y2: "18", key: "nzw8ys" }]
];
const Server = createLucideIcon("server", __iconNode);
function useIcpToCyclesRate(autoRefresh = true) {
  const { actor, isAuthenticated, isLoading } = useBackend();
  return useQuery({
    queryKey: ["icpToCyclesRate"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.getIcpToCyclesRate();
    },
    enabled: isAuthenticated && !isLoading && !!actor,
    refetchInterval: autoRefresh ? 6e4 : false,
    staleTime: 3e4,
    retry: 2,
    throwOnError: false
  });
}
function useRefreshIcpToCyclesRate() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.refreshIcpToCyclesRate();
    },
    onSuccess: (rate) => {
      queryClient.setQueryData(["icpToCyclesRate"], rate);
      void queryClient.invalidateQueries({ queryKey: ["icpToCyclesRate"] });
    }
  });
}
export {
  Server as S,
  useRefreshIcpToCyclesRate as a,
  useIcpToCyclesRate as u
};
