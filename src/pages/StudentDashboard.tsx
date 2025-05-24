
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, User, Book } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProtectedRoute from "@/components/ProtectedRoute";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [studentName, setStudentName] = useState<string>("");

  useEffect(() => {
    const loadStudentData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('students')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading student data:', error);
        } else if (data) {
          setStudentName(data.full_name);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    loadStudentData();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <ProtectedRoute requiredUserType="student">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-700">Student Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Welcome{studentName ? `, ${studentName}` : ""} to your academic portal
            </h2>
            <p className="text-gray-600">
              Complete your profile, build your resume, and discover skills in demand to enhance your career prospects.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Profile Card */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-xl text-center">Profile</CardTitle>
                <CardDescription className="text-center">
                  Complete your academic and personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                <p>Fill in your details including skills, education, and work experience</p>
              </CardContent>
              <CardFooter className="flex justify-center pt-0">
                <Button onClick={() => navigate("/student/profile")} className="bg-indigo-600 hover:bg-indigo-700">
                  Go to Profile
                </Button>
              </CardFooter>
            </Card>
            
            {/* Resume Builder Card */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-xl text-center">Resume Builder</CardTitle>
                <CardDescription className="text-center">
                  Generate a professional resume instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                <p>Create a standardized resume based on your profile information</p>
              </CardContent>
              <CardFooter className="flex justify-center pt-0">
                <Button onClick={() => navigate("/student/resume-builder")} className="bg-indigo-600 hover:bg-indigo-700">
                  Build Resume
                </Button>
              </CardFooter>
            </Card>
            
            {/* Skill Suggester Card */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-xl text-center">Skill Suggester</CardTitle>
                <CardDescription className="text-center">
                  Discover in-demand skills in the job market
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                <p>Compare your skills with market demands and get learning suggestions</p>
              </CardContent>
              <CardFooter className="flex justify-center pt-0">
                <Button onClick={() => navigate("/student/skill-suggester")} className="bg-indigo-600 hover:bg-indigo-700">
                  Check Skills
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Updates</h3>
            <p className="text-gray-600">
              Connect with peers, explore job opportunities, and stay updated with college announcements.
            </p>
            
            {/* Placeholder for future features */}
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-500">More features coming soon...</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default StudentDashboard;
