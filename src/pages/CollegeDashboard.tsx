
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ChartBar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CollegeDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    console.log('College logout clicked');
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700">College Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to your college portal</h2>
          <p className="text-gray-600">
            Search for students based on skills and track placement analytics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Student Search Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-xl text-center">Search Students</CardTitle>
              <CardDescription className="text-center">
                Find students by skills and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              <p>Search your student database by skills to match with job requirements</p>
            </CardContent>
            <CardFooter className="flex justify-center pt-0">
              <Button onClick={() => navigate("/college/search-students")} className="bg-indigo-600 hover:bg-indigo-700">
                Search Database
              </Button>
            </CardFooter>
          </Card>
          
          {/* Placement Analytics Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBar className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-xl text-center">Placement Analytics</CardTitle>
              <CardDescription className="text-center">
                Track and analyze placement statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              <p>Monitor placement rates, average packages, and performance metrics</p>
            </CardContent>
            <CardFooter className="flex justify-center pt-0">
              <Button onClick={() => navigate("/college/placement-analytics")} className="bg-indigo-600 hover:bg-indigo-700">
                View Analytics
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activities</h3>
          
          {/* Placeholder for future activities */}
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm text-gray-500">No recent activities to display.</p>
          </div>
          
          <div className="mt-6">
            <p className="text-gray-600 mb-2">Quick Stats:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-indigo-50 p-3 rounded-md">
                <p className="text-xs text-gray-500">Total Students</p>
                <p className="font-semibold text-lg">0</p>
              </div>
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-xs text-gray-500">Placed</p>
                <p className="font-semibold text-lg">0</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-xs text-gray-500">Avg. Package</p>
                <p className="font-semibold text-lg">₹0 LPA</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-md">
                <p className="text-xs text-gray-500">Highest Package</p>
                <p className="font-semibold text-lg">₹0 LPA</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollegeDashboard;
