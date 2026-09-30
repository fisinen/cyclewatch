import Types "../types/funding";
import Common "../types/common";

module {
  // Read the current ICP-to-Cycles rate.
  public func getRate(rate : Types.IcpToCyclesRate) : Types.IcpToCyclesRate {
    rate;
  };

  // Store a freshly observed ICP-to-Cycles rate.
  public func updateRate(
    rateState : { var icpPerXdr : Nat; var updatedAt : Common.Timestamp },
    newRate : Types.IcpToCyclesRate,
  ) {
    rateState.icpPerXdr := newRate.icpPerXdr;
    rateState.updatedAt := newRate.updatedAt;
  };
};
