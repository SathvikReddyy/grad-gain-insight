
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const LoginRegister = () => {
  const { userType } = useParams<{ userType: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Form states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [collegeName, setCollegeName] = useState<string>("");
  const [collegeId, setCollegeId] = useState<string>("");
  const [placementOfficer, setPlacementOfficer] = useState<string>("");
  const [officerEmail, setOfficerEmail] = useState<string>("");
  const [officerMobile, setOfficerMobile] = useState<string>("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate login (replace with actual authentication)
    if (email && password) {
      if (userType === "student") {
        navigate("/student/dashboard");
      } else if (userType === "college") {
        navigate("/college/dashboard");
      }
      
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Email and password are required.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate registration (replace with actual registration)
    if (userType === "student") {
      if (!email || !password || !name || !mobile || !collegeName) {
        toast({
          title: "Registration Failed",
          description: "Please fill all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      // TODO: Check if college exists before allowing registration
      
      navigate("/student/profile");
      toast({
        title: "Registration Successful",
        description: "Please complete your profile.",
      });
    } else if (userType === "college") {
      if (!email || !password || !collegeName || !collegeId || !placementOfficer || !officerEmail || !officerMobile) {
        toast({
          title: "Registration Failed",
          description: "Please fill all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      navigate("/college/dashboard");
      toast({
        title: "Registration Successful",
        description: "Welcome to Placement & Academic Hub!",
      });
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
                  />
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Login
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input 
                    id="reg-password" 
                    type="password" 
                    placeholder="Create a password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="college-name">College Name</Label>
                      <Input 
                        id="college-name" 
                        type="text" 
                        placeholder="Enter your college name" 
                        value={collegeName} 
                        onChange={(e) => setCollegeName(e.target.value)} 
                        required 
                      />
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
                      />
                    </div>
                  </>
                )}
                
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Register
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
