// client/src/App.tsx
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
import BookingDetail from "@/pages/BookingDetail";     // ✅ NEW
import BookingEdit from "@/pages/BookingEdit";         // ✅ NEW
import ListingDetail from "@/pages/ListingDetail";
import SearchResults from "@/pages/SearchResults";
import NotFound from "@/pages/not-found";
import ListingEdit from "@/pages/ListingEdit";
import ReviewCreate from "@/pages/ReviewCreate";
import ReviewEdit from "@/pages/ReviewEdit";
import ListingCreate from "@/pages/ListingCreate";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      
      {/* ✅ COMPLETE BOOKINGS ROUTES */}
      <Route path="/bookings" component={Bookings} />
      <Route path="/booking/:id" component={BookingDetail} />
      <Route path="/booking-edit/:id" component={BookingEdit} />
      <Route path="/create-listing" component={ListingCreate} />

      <Route path="/listing/:id" component={ListingDetail} />
      <Route path="/edit-listing/:id" component={ListingEdit} />
      <Route path="/search" component={SearchResults} />
      <Route path="/reviews/create" component={ReviewCreate} />
      <Route path="/reviews/edit/:id" component={ReviewEdit} />
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


//redeploy

console.log('API:', import.meta.env.VITE_API_URL)