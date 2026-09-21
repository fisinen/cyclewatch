import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Activity, ArrowRight, Loader2, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";

export function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoading =
    loginStatus === "logging-in" || loginStatus === "initializing";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-lg">
              <Zap size={20} className="text-primary" />
            </div>
            <span className="text-xl font-display font-semibold text-foreground">
              Cycle<span className="text-primary">Watch</span>
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Monitor your canister cycles
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connect your ICP canisters to track cycle balances, burn rates,
              and depletion projections in one unified dashboard.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-md bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                  <feature.icon size={14} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {feature.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <Button
            onClick={() => login()}
            disabled={isLoading}
            data-ocid="login-btn"
            className="w-full h-11 font-semibold text-sm gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                Sign in with Internet Identity
                <ArrowRight size={16} />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Secured by the Internet Computer.{" "}
            <span className="text-foreground/70">
              No passwords, no custodians.
            </span>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1.5">
          <Shield size={12} />
          Your identity and assets remain fully in your control
        </p>
      </motion.div>
    </div>
  );
}

const features = [
  {
    icon: Activity,
    label: "Real-time cycle monitoring",
    description:
      "Track cycle balances across all your canisters with live refresh",
  },
  {
    icon: Zap,
    label: "Multi-canister management",
    description:
      "Connect any number of canisters and monitor them from one dashboard",
  },
  {
    icon: ArrowRight,
    label: "Cost projection & alerts",
    description:
      "See burn rates, days remaining, and depletion dates at a glance",
  },
];
