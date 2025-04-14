
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import ProfileSetup from "./pages/ProfileSetup";
import Profile from "./pages/Profile";
import ClientRequests from "./pages/ClientRequests";
import Sessions from "./pages/Sessions";
import ClientSession from "./pages/ClientSession";
import Schedule from "./pages/Schedule";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Create a new QueryClient instance with explicit configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                {/* Routes that require authentication */}
                <Route path="/reset-password" element={<PasswordReset />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                
                {/* Main layout with navbar */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/client-requests" element={<ClientRequests />} />
                  <Route path="/sessions" element={<Sessions />} />
                  <Route path="/client-session/:clientId" element={<ClientSession />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
