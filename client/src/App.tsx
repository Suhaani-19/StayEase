import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Bookings from "@/pages/Bookings";
import ListingDetail from "@/pages/ListingDetail";
import SearchResults from "@/pages/SearchResults";
import NotFound from "@/pages/not-found";
import ListingEdit from "@/pages/ListingEdit";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/bookings" component={Bookings} />
      <Route path="/listing/:id" component={ListingDetail} />
      <Route path="/edit-listing/:id" component={ListingEdit} />

      <Route path="/search" component={SearchResults} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
