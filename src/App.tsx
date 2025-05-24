
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginRegister from "./pages/LoginRegister";
import StudentDashboard from "./pages/StudentDashboard";
import CollegeDashboard from "./pages/CollegeDashboard";
import StudentProfile from "./pages/StudentProfile";
import ResumeBuilder from "./pages/ResumeBuilder";
import SkillSuggester from "./pages/SkillSuggester";
import SearchStudents from "./pages/SearchStudents";
import PlacementAnalytics from "./pages/PlacementAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login/:userType" element={<LoginRegister />} />
            <Route path="/register/:userType" element={<LoginRegister />} />
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute requiredUserType="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/profile" 
              element={
                <ProtectedRoute requiredUserType="student">
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/resume-builder" 
              element={
                <ProtectedRoute requiredUserType="student">
                  <ResumeBuilder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/skill-suggester" 
              element={
                <ProtectedRoute requiredUserType="student">
                  <SkillSuggester />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/college/dashboard" 
              element={
                <ProtectedRoute requiredUserType="college">
                  <CollegeDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/college/search-students" 
              element={
                <ProtectedRoute requiredUserType="college">
                  <SearchStudents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/college/placement-analytics" 
              element={
                <ProtectedRoute requiredUserType="college">
                  <PlacementAnalytics />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
