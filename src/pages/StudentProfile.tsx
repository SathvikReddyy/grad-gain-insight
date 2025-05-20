
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const StudentProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Student details state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "",
    skills: "",
    collegeCgpa: "",
    tenthMarks: "",
    twelfthMarks: "",
    projects: "",
    workExperience: ""
  });
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle certificate upload (placeholder)
  const handleCertificateUpload = () => {
    toast({
      title: "Upload Initiated",
      description: "Certificate upload feature will be implemented with backend integration.",
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.dob || !formData.skills) {
      toast({
        title: "Incomplete Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Save profile data (in a real app, this would be saved to a database)
    toast({
      title: "Profile Saved",
      description: "Your profile information has been updated successfully.",
    });
    
    setIsEditing(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700 mb-4 md:mb-0">Student Profile</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/student/dashboard")}>
              Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
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
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      required
                    />
                  </div>
                </div>
                
                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Academic Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="collegeCgpa">College CGPA *</Label>
                    <Input
                      id="collegeCgpa"
                      name="collegeCgpa"
                      type="text"
                      value={formData.collegeCgpa}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tenthMarks">10th Standard Marks *</Label>
                    <Input
                      id="tenthMarks"
                      name="tenthMarks"
                      type="text"
                      value={formData.tenthMarks}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twelfthMarks">12th Standard Marks *</Label>
                    <Input
                      id="twelfthMarks"
                      name="twelfthMarks"
                      type="text"
                      value={formData.twelfthMarks}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="space-y-2">
                      <Label htmlFor="certificates">Upload Certificates</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="certificates" 
                          type="file" 
                          multiple 
                          className="flex-1" 
                        />
                        <Button type="button" onClick={handleCertificateUpload} size="sm">
                          Upload
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Skills and Experience */}
              <div className="pt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Skills & Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills *</Label>
                    <Textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      placeholder="List your technical and soft skills"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workExperience">Work Experience</Label>
                    <Textarea
                      id="workExperience"
                      name="workExperience"
                      value={formData.workExperience}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      placeholder="Describe any internships or work experience"
                    />
                  </div>
                
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="projects">Projects</Label>
                    <Textarea
                      id="projects"
                      name="projects"
                      value={formData.projects}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      placeholder="Describe your projects with technologies used"
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
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Profile</Button>
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
  );
};

export default StudentProfile;
