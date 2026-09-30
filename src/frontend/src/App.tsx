import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { LoginPage } from "./components/LoginPage";

import { Skeleton } from "@/components/ui/skeleton";
// Lazy page imports
import { Suspense, lazy } from "react";

const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const ActivityPage = lazy(() =>
  import("./pages/ActivityPage").then((m) => ({ default: m.ActivityPage })),
);
const AccountPage = lazy(() =>
  import("./pages/AccountPage").then((m) => ({ default: m.AccountPage })),
);

function PageLoader() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-80" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    </div>
  );
}

// Auth guard component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isInitializing, isLoginSuccess, identity } = useInternetIdentity();

  if (isInitializing) {
    return <PageLoader />;
  }

  // Consider authenticated if identity exists (handles page reload with stored identity)
  if (!isLoginSuccess && !identity) {
    return <LoginPage />;
  }

  return <>{children}</>;
}

// Routes
const rootRoute = createRootRoute({
  component: () => (
    <AuthGuard>
      <Layout />
    </AuthGuard>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
  component: () => null,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DashboardPage />
    </Suspense>
  ),
});

const activityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/activity",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ActivityPage />
    </Suspense>
  ),
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AccountPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  activityRoute,
  accountRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
