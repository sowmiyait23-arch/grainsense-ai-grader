import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Stale-deploy recovery: when a published app is redeployed, tabs still open on
// the old build fail to fetch the now-removed code-split chunks (e.g. a route
// module) and show a blank screen. Vite emits `vite:preloadError` for those
// failed dynamic imports — reload once to pick up the new build. The timestamp
// guard prevents a reload loop if the failure is a real network outage, and the
// guard expires so a deploy a few minutes later still triggers recovery.
if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", () => {
    const KEY = "grainsense.chunkReloadAt";
    const last = Number(sessionStorage.getItem(KEY) ?? 0);
    if (Date.now() - last > 10_000) {
      sessionStorage.setItem(KEY, String(Date.now()));
      window.location.reload();
    }
  });
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
