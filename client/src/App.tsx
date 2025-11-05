import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, useLocation } from "wouter";
import Home from "@/pages/home";
import Resume from "@/pages/resume";
import ResumeUploadSignIn from "@/pages/resume-upload-signin";
import UploadResumeDashboard from "@/pages/upload-resume-dashboard";
import { useGlobalAnimations } from "@/hooks/useGlobalAnimations";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/resume" component={Resume} />
      <Route path="/upload" component={UploadResumeDashboard} />
      <Route path="/sign-in" component={ResumeUploadSignIn} />
      
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
