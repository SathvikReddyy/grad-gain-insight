
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface StudentData {
  name: string;
  email: string;
  phone: string;
  skills: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    score: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    techStack: string;
  }>;
  experience: Array<{
    position: string;
    company: string;
    duration: string;
    responsibilities: string;
  }>;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [resumeGenerated, setResumeGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load student data
  useEffect(() => {
    const loadStudentData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading student data:', error);
          setIsProfileComplete(false);
        } else if (data) {
          // Check if profile has essential information
          const hasBasicInfo = Boolean(data.full_name && data.mobile && data.college_name);
          setIsProfileComplete(hasBasicInfo);
          
          if (hasBasicInfo) {
            setStudentData({
              name: data.full_name,
              email: user.email || "",
              phone: data.mobile,
              skills: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ""),
              education: [{
                degree: data.course || "Not specified",
                institution: data.college_name,
                year: data.year_of_study ? `${data.year_of_study} Year` : "Not specified",
                score: data.cgpa ? `${data.cgpa} CGPA` : "Not specified"
              }],
              projects: [], // These would need separate tables in a real app
              experience: [], // These would need separate tables in a real app
              linkedinUrl: data.linkedin_url,
              githubUrl: data.github_url,
              portfolioUrl: data.portfolio_url
            });
          }
        } else {
          setIsProfileComplete(false);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setIsProfileComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentData();
  }, [user]);

  const generateResume = () => {
    if (!isProfileComplete) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile before generating a resume.",
        variant: "destructive",
      });
      navigate("/student/profile");
      return;
    }
    
    setResumeGenerated(true);
    toast({
      title: "Resume Generated",
      description: "Your resume has been generated successfully.",
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700 mb-4 md:mb-0">Resume Builder</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/student/dashboard")}>
              Dashboard
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!resumeGenerated ? (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Your Professional Resume</h2>
              <p className="text-gray-600 mb-6">
                Generate a professional resume based on your profile information. Make sure your profile is complete with all necessary details.
              </p>
              <Button 
                onClick={generateResume} 
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={!isProfileComplete}
              >
                Generate Resume
              </Button>
              
              {!isProfileComplete && (
                <p className="text-sm text-red-500 mt-2">
                  Complete your profile first - we need at least your name, mobile, and college name.
                </p>
              )}
            </div>
          ) : (
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Resume</h2>
              <div className="flex justify-center gap-4 mb-8">
                <Button onClick={() => window.print()}>
                  Print Resume
                </Button>
                <Button variant="outline" onClick={() => setResumeGenerated(false)}>
                  Regenerate
                </Button>
              </div>
            </div>
          )}
          
          {resumeGenerated && studentData && (
            <Card className="mb-8 print:shadow-none print:border-none" id="resume-template">
              <CardContent className="p-8">
                {/* Resume Header */}
                <div className="text-center mb-6 border-b pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{studentData.name}</h2>
                  <div className="flex flex-wrap justify-center gap-x-4 text-sm text-gray-600 mt-2">
                    <span>{studentData.email}</span>
                    <span>{studentData.phone}</span>
                    {studentData.linkedinUrl && (
                      <span>LinkedIn: {studentData.linkedinUrl}</span>
                    )}
                    {studentData.githubUrl && (
                      <span>GitHub: {studentData.githubUrl}</span>
                    )}
                  </div>
                </div>
                
                {/* Skills Section */}
                {studentData.skills && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Skills</h3>
                    <p>{studentData.skills}</p>
                  </div>
                )}
                
                {/* Education Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Education</h3>
                  {studentData.education.map((edu, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{edu.degree}</h4>
                        <span className="text-sm">{edu.year}</span>
                      </div>
                      <p className="text-gray-700">{edu.institution}</p>
                      <p className="text-sm text-gray-600">Score: {edu.score}</p>
                    </div>
                  ))}
                </div>
                
                {/* Portfolio Section */}
                {studentData.portfolioUrl && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Portfolio</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Portfolio URL:</span> {studentData.portfolioUrl}
                    </p>
                  </div>
                )}
                
                {/* Projects Section - placeholder for future implementation */}
                {studentData.projects.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Projects</h3>
                    {studentData.projects.map((project, index) => (
                      <div key={index} className="mb-3">
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm">{project.description}</p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Tech Stack:</span> {project.techStack}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Experience Section - placeholder for future implementation */}
                {studentData.experience.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Experience</h3>
                    {studentData.experience.map((exp, index) => (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{exp.position}</h4>
                          <span className="text-sm">{exp.duration}</span>
                        </div>
                        <p className="text-gray-700">{exp.company}</p>
                        <p className="text-sm">{exp.responsibilities}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/student/dashboard")}
              className="w-full md:w-auto"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
