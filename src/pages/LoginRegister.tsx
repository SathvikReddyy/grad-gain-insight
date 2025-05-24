
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const LoginRegister = () => {
  const { userType } = useParams<{ userType: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [registeredColleges, setRegisteredColleges] = useState<Array<{id: string, college_name: string}>>([]);

  // Form states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>("");
  const [collegeName, setCollegeName] = useState<string>("");
  const [collegeId, setCollegeId] = useState<string>("");
  const [placementOfficer, setPlacementOfficer] = useState<string>("");
  const [officerEmail, setOfficerEmail] = useState<string>("");
  const [officerMobile, setOfficerMobile] = useState<string>("");

  // Load registered colleges for student registration
  useEffect(() => {
    const loadColleges = async () => {
      if (userType === "student") {
        try {
          const { data, error } = await supabase
            .from('colleges')
            .select('id, college_name')
            .order('college_name');
          
          if (error) {
            console.error('Error loading colleges:', error);
          } else {
            setRegisteredColleges(data || []);
          }
        } catch (error) {
          console.error('Error fetching colleges:', error);
        }
      }
    };

    loadColleges();
  }, [userType]);

  // Check if user is already authenticated and redirect
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (!loading && user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', user.id)
            .single();
          
          if (profile?.user_type === 'student') {
            navigate('/student/dashboard');
          } else if (profile?.user_type === 'college') {
            navigate('/college/dashboard');
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
        }
      }
    };
    
    checkAuthAndRedirect();
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        // Get user profile to determine redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile?.user_type === 'student') {
          navigate('/student/dashboard');
        } else if (profile?.user_type === 'college') {
          navigate('/college/dashboard');
        }

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate required fields based on user type
      if (userType === "student") {
        if (!email || !password || !name || !mobile || !selectedCollegeId) {
          toast({
            title: "Registration Failed",
            description: "Please fill all required fields.",
            variant: "destructive",
          });
          return;
        }
      } else if (userType === "college") {
        if (!email || !password || !collegeName || !collegeId || !placementOfficer || !officerEmail || !officerMobile) {
          toast({
            title: "Registration Failed",
            description: "Please fill all required fields.",
            variant: "destructive",
          });
          return;
        }
      }

      // Create user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
          }
        }
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        // Insert additional user data based on type
        if (userType === "student") {
          // Get selected college name
          const selectedCollege = registeredColleges.find(college => college.id === selectedCollegeId);
          
          const { error: studentError } = await supabase
            .from('students')
            .insert({
              id: data.user.id,
              full_name: name,
              mobile,
              college_name: selectedCollege?.college_name || "",
            });

          if (studentError) {
            console.error("Error creating student profile:", studentError);
          }
        } else if (userType === "college") {
          const { error: collegeError } = await supabase
            .from('colleges')
            .insert({
              id: data.user.id,
              college_name: collegeName,
              college_id: collegeId,
              placement_officer_name: placementOfficer,
              officer_email: officerEmail,
              officer_mobile: officerMobile,
            });

          if (collegeError) {
            console.error("Error creating college profile:", collegeError);
          }
        }

        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account before logging in.",
        });
        
        // Switch to login tab
        setActiveTab("login");
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Capitalize the user type for display purposes
  const userTypeDisplay = userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-indigo-700">{userTypeDisplay} Portal</CardTitle>
          <CardDescription className="text-center">
            Login or register for the {userType} account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="py-2">Login</TabsTrigger>
              <TabsTrigger value="register" className="py-2">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Common fields for all user types */}
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input 
                    id="reg-email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input 
                    id="reg-password" 
                    type="password" 
                    placeholder="Create a password (min 6 characters)" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    minLength={6}
                    disabled={isLoading}
                  />
                </div>
                
                {userType === "student" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="Enter your full name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input 
                        id="mobile" 
                        type="tel" 
                        placeholder="Enter your mobile number" 
                        value={mobile} 
                        onChange={(e) => setMobile(e.target.value)} 
                        required 
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="college-select">Select College</Label>
                      <Select value={selectedCollegeId} onValueChange={setSelectedCollegeId} disabled={isLoading}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your college" />
                        </SelectTrigger>
                        <SelectContent>
                          {registeredColleges.map((college) => (
                            <SelectItem key={college.id} value={college.id}>
                              {college.college_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                {userType === "college" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="college-name">College Name</Label>
                      <Input 
                        id="college-name" 
                        type="text" 
                        placeholder="Enter college name" 
                        value={collegeName} 
                        onChange={(e) => setCollegeName(e.target.value)} 
                        required 
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="college-id">College ID</Label>
                      <Input 
                        id="college-id" 
                        type="text" 
                        placeholder="Enter college ID" 
                        value={collegeId} 
                        onChange={(e) => setCollegeId(e.target.value)} 
                        required 
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="placement-officer">Placement Officer Name</Label>
                      <Input 
                        id="placement-officer" 
                        type="text" 
                        placeholder="Enter placement officer name" 
                        value={placementOfficer} 
                        onChange={(e) => setPlacementOfficer(e.target.value)} 
                        required 
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="officer-email">Officer Email</Label>
                      <Input 
                        id="officer-email" 
                        type="email" 
                        placeholder="Enter officer email" 
                        value={officerEmail} 
                        onChange={(e) => setOfficerEmail(e.target.value)} 
                        required 
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="officer-mobile">Officer Mobile</Label>
                      <Input 
                        id="officer-mobile" 
                        type="tel" 
                        placeholder="Enter officer mobile number" 
                        value={officerMobile} 
                        onChange={(e) => setOfficerMobile(e.target.value)} 
                        required 
                        disabled={isLoading}
                      />
                    </div>
                  </>
                )}
                
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Register"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginRegister;
