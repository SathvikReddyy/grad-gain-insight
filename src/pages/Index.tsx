
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  const handleUserSelection = (userType: string) => {
    navigate(`/login/${userType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-indigo-800 mb-6">Placement & Academic Hub</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your one-stop platform for career development, skill enhancement, and academic networking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Student Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-indigo-700">Student</CardTitle>
              <CardDescription className="text-center">
                Build your profile, generate your resume, and enhance your skills
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700" 
                onClick={() => handleUserSelection('student')}
              >
                Login / Register
              </Button>
            </CardContent>
          </Card>

          {/* College Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-indigo-700">College</CardTitle>
              <CardDescription className="text-center">
                Manage your students, track placements, and analyze performance
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700" 
                onClick={() => handleUserSelection('college')}
              >
                Login / Register
              </Button>
            </CardContent>
          </Card>

          {/* Company Card - Reserved for future use */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-indigo-700">Coming Soon</CardTitle>
              <CardDescription className="text-center">
                New features and capabilities to be added soon
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button className="bg-gray-400 hover:bg-gray-500" disabled>
                Stay Tuned
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-4">
              <h3 className="text-xl font-medium text-indigo-600 mb-2">For Students</h3>
              <p className="text-gray-600">Build professional resumes, get skill suggestions, and connect with peers</p>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-medium text-indigo-600 mb-2">For Colleges</h3>
              <p className="text-gray-600">Search student database by skills and track placement analytics</p>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-medium text-indigo-600 mb-2">Seamless Integration</h3>
              <p className="text-gray-600">Connect your academic journey with professional opportunities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
