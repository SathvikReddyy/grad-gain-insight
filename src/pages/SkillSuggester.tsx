import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProtectedRoute from "@/components/ProtectedRoute";

// In-demand skills data
const inDemandSkills = {
  technical: [
    "React", "Node.js", "Python", "Data Science", "Machine Learning", 
    "AWS", "Azure", "Docker", "Kubernetes", "TypeScript", "Go",
    "Flutter", "Java", "Spring Boot", "DevOps", "CI/CD", "Firebase"
  ],
  soft: [
    "Communication", "Teamwork", "Problem Solving", "Critical Thinking",
    "Adaptability", "Leadership", "Time Management", "Emotional Intelligence"
  ]
};

const SkillSuggester = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [userSkills, setUserSkills] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [skillGap, setSkillGap] = useState<string[]>([]);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [profileSkills, setProfileSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load student's profile skills
  useEffect(() => {
    const loadStudentSkills = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('students')
          .select('skills')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading student skills:', error);
        } else if (data && data.skills && data.skills.length > 0) {
          setProfileSkills(data.skills);
          setUserSkills(data.skills.join(', '));
        }
      } catch (error) {
        console.error('Error fetching student skills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentSkills();
  }, [user]);

  const analyzeSkills = () => {
    if (!userSkills.trim()) {
      return;
    }
    
    // Simple skill comparison
    const userSkillsArray = userSkills.split(',').map(skill => skill.trim().toLowerCase());
    
    const allInDemandSkills = [...inDemandSkills.technical, ...inDemandSkills.soft]
      .map(skill => skill.toLowerCase());
      
    // Find matched skills
    const matched = userSkillsArray.filter(skill => 
      allInDemandSkills.includes(skill)
    );
    
    // Find skill gap (skills in demand but not in user's skills)
    const gap = allInDemandSkills.filter(skill => 
      !userSkillsArray.includes(skill)
    );
    
    setMatchedSkills(matched.map(s => s.charAt(0).toUpperCase() + s.slice(1)));
    setSkillGap(gap.map(s => s.charAt(0).toUpperCase() + s.slice(1)));
    setAnalyzed(true);
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
    <ProtectedRoute requiredUserType="student">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-700 mb-4 md:mb-0">Skill Suggester</h1>
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
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Analyze Your Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    {profileSkills.length > 0 
                      ? "Your skills from your profile are loaded below. You can modify them if needed to compare with current industry demands."
                      : "No skills found in your profile. Please add skills in your profile first, or enter them below to compare with current industry demands."
                    }
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skills">Your Skills</Label>
                    <Textarea
                      id="skills"
                      placeholder="E.g., JavaScript, React, Communication, Problem Solving"
                      value={userSkills}
                      onChange={(e) => setUserSkills(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <Button 
                    onClick={analyzeSkills} 
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={!userSkills.trim()}
                  >
                    Analyze Skills
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {analyzed && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Matched Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">Skills You Have</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {matchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {matchedSkills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No in-demand skills found in your profile.</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Skill Gap */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-amber-600">Skills to Learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {skillGap.slice(0, 15).map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            {skill}
                          </Badge>
                        ))}
                        {skillGap.length > 15 && (
                          <Badge variant="outline" className="bg-gray-50">
                            +{skillGap.length - 15} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Industry Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Based on your skills analysis, here are some suggestions to enhance your profile:
                      </p>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-800">Technical Skills to Consider</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          <li>Focus on cloud technologies like AWS, Azure, or Google Cloud</li>
                          <li>Learn a modern JavaScript framework if you haven't already</li>
                          <li>Consider exploring data science and machine learning basics</li>
                          <li>Gain experience with containerization and orchestration tools</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-800">Soft Skills to Develop</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          <li>Practice clear communication through documentation and presentations</li>
                          <li>Develop project management skills</li>
                          <li>Learn to work effectively in remote/distributed teams</li>
                          <li>Build your problem-solving abilities through coding challenges</li>
                        </ul>
                      </div>
                      
                      <div className="bg-indigo-50 p-4 rounded-md">
                        <p className="text-indigo-700 font-medium">Learning Resources</p>
                        <p className="text-gray-600 text-sm mt-1">
                          Consider platforms like Coursera, Udemy, freeCodeCamp, and YouTube for learning these skills. 
                          Many companies also value certifications from major cloud providers and technology companies.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            <div className="mt-8">
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
    </ProtectedRoute>
  );
};

export default SkillSuggester;
