
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProtectedRoute from "@/components/ProtectedRoute";

const StudentProfile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Student details state
  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    college_name: "",
    course: "",
    year_of_study: "",
    cgpa: "",
    skills: [] as string[],
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    placement_status: "not_placed"
  });
  
  // Load student data on component mount
  useEffect(() => {
    const loadStudentData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading student data:', error);
          return;
        }

        if (data) {
          setFormData({
            full_name: data.full_name || "",
            mobile: data.mobile || "",
            college_name: data.college_name || "",
            course: data.course || "",
            year_of_study: data.year_of_study?.toString() || "",
            cgpa: data.cgpa?.toString() || "",
            skills: data.skills || [],
            linkedin_url: data.linkedin_url || "",
            github_url: data.github_url || "",
            portfolio_url: data.portfolio_url || "",
            placement_status: data.placement_status || "not_placed"
          });
        }
      } catch (error) {
        console.error('Error loading student data:', error);
      } finally {
        setInitialLoad(false);
      }
    };

    loadStudentData();
  }, [user]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle skills input (comma-separated)
  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skillsText = e.target.value;
    const skillsArray = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData({
      ...formData,
      skills: skillsArray
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validate required fields
    if (!formData.full_name || !formData.mobile || !formData.college_name) {
      toast({
        title: "Incomplete Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updateData = {
        full_name: formData.full_name,
        mobile: formData.mobile,
        college_name: formData.college_name,
        course: formData.course || null,
        year_of_study: formData.year_of_study ? parseInt(formData.year_of_study) : null,
        cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null,
        skills: formData.skills,
        linkedin_url: formData.linkedin_url || null,
        github_url: formData.github_url || null,
        portfolio_url: formData.portfolio_url || null,
        placement_status: formData.placement_status,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('students')
        .upsert({
          id: user.id,
          ...updateData
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save profile information.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Profile Saved",
        description: "Your profile information has been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  
  if (initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <ProtectedRoute requiredUserType="student">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-700 mb-4 md:mb-0">Student Profile</h1>
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
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Personal & Academic Information</CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Complete or update your profile information" 
                  : "View your profile information"}
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Personal Details</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Phone Number *</Label>
                      <Input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="college_name">College Name *</Label>
                      <Input
                        id="college_name"
                        name="college_name"
                        value={formData.college_name}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="course">Course</Label>
                      <Input
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        placeholder="e.g., Computer Science Engineering"
                      />
                    </div>
                  </div>
                  
                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Academic Details</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="year_of_study">Year of Study</Label>
                      <Input
                        id="year_of_study"
                        name="year_of_study"
                        type="number"
                        min="1"
                        max="5"
                        value={formData.year_of_study}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        placeholder="e.g., 3"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cgpa">CGPA</Label>
                      <Input
                        id="cgpa"
                        name="cgpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={formData.cgpa}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        placeholder="e.g., 8.5"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                      <Input
                        id="linkedin_url"
                        name="linkedin_url"
                        type="url"
                        value={formData.linkedin_url}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="github_url">GitHub URL</Label>
                      <Input
                        id="github_url"
                        name="github_url"
                        type="url"
                        value={formData.github_url}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Skills and Experience */}
                <div className="pt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Skills & Portfolio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Textarea
                        id="skills"
                        value={formData.skills.join(', ')}
                        onChange={handleSkillsChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        placeholder="Enter skills separated by commas (e.g., JavaScript, React, Python)"
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="portfolio_url">Portfolio URL</Label>
                      <Input
                        id="portfolio_url"
                        name="portfolio_url"
                        type="url"
                        value={formData.portfolio_url}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/student/dashboard")}
                >
                  Back to Dashboard
                </Button>
                
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default StudentProfile;
