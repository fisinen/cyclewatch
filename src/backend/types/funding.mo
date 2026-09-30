import Common "common";

module {
  // Live ICP-to-Cycles rate sourced from the CMC.
  // 1 XDR = 1_000_000_000_000 cycles; icpPerXdr is the ICP price of one XDR.
  public type IcpToCyclesRate = {
    icpPerXdr : Nat;
    updatedAt : Common.Timestamp;
  };
};
