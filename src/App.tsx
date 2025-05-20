
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login/:userType" element={<LoginRegister />} />
          <Route path="/register/:userType" element={<LoginRegister />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/resume-builder" element={<ResumeBuilder />} />
          <Route path="/student/skill-suggester" element={<SkillSuggester />} />
          <Route path="/college/dashboard" element={<CollegeDashboard />} />
          <Route path="/college/search-students" element={<SearchStudents />} />
          <Route path="/college/placement-analytics" element={<PlacementAnalytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
