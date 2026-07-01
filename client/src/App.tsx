import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, useLocation } from "wouter";
import Home from "@/pages/home";
import { lazy, Suspense } from "react";

const Resume = lazy(() => import("@/pages/resume"));
import { useGlobalAnimations } from "@/hooks/useGlobalAnimations";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/resume">
        <Suspense fallback={null}>
          <Resume />
        </Suspense>
      </Route>

      <Route>404: Page not found</Route>
    </Switch>
  );
}

function App() {
  // Initialize global animation system
  useGlobalAnimations();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
