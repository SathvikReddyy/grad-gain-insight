
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "@/components/ui/use-toast";

// Mock placement data
const initialPlacementData = [
  { week: "Week 1", placed: 12, avgPackage: 5.2, highestPackage: 12 },
  { week: "Week 2", placed: 15, avgPackage: 5.8, highestPackage: 14 },
  { week: "Week 3", placed: 10, avgPackage: 6.1, highestPackage: 15 },
  { week: "Week 4", placed: 20, avgPackage: 6.5, highestPackage: 18 }
];

const PlacementAnalytics = () => {
  const navigate = useNavigate();
  const [placementData, setPlacementData] = useState(initialPlacementData);
  const [newEntry, setNewEntry] = useState({
    week: "",
    placed: "",
    avgPackage: "",
    highestPackage: ""
  });
  
  // Calculate totals
  const totalPlaced = placementData.reduce((sum, data) => sum + data.placed, 0);
  const overallAvgPackage = placementData.reduce((sum, data) => sum + data.avgPackage, 0) / placementData.length;
  const overallHighestPackage = Math.max(...placementData.map(data => data.highestPackage));
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEntry({
      ...newEntry,
      [name]: value
    });
  };
  
  // Add new placement data
  const addPlacementData = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newEntry.week || !newEntry.placed || !newEntry.avgPackage || !newEntry.highestPackage) {
      toast({
        title: "Incomplete Data",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Add new entry
    const formattedEntry = {
      week: newEntry.week,
      placed: Number(newEntry.placed),
      avgPackage: Number(newEntry.avgPackage),
      highestPackage: Number(newEntry.highestPackage)
    };
    
    setPlacementData([...placementData, formattedEntry]);
    
    // Reset form
    setNewEntry({
      week: "",
      placed: "",
      avgPackage: "",
      highestPackage: ""
    });
    
    toast({
      title: "Data Added",
      description: "Placement data has been added successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700 mb-4 md:mb-0">Placement Analytics</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/college/dashboard")}>
              Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Placement Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-green-50">
                <CardContent className="p-6">
                  <div className="text-green-800 text-sm font-medium">Total Students Placed</div>
                  <div className="text-3xl font-bold text-green-700 mt-2">{totalPlaced}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50">
                <CardContent className="p-6">
                  <div className="text-blue-800 text-sm font-medium">Average Package (LPA)</div>
                  <div className="text-3xl font-bold text-blue-700 mt-2">₹{overallAvgPackage.toFixed(2)}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50">
                <CardContent className="p-6">
                  <div className="text-purple-800 text-sm font-medium">Highest Package (LPA)</div>
                  <div className="text-3xl font-bold text-purple-700 mt-2">₹{overallHighestPackage.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Placement Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={placementData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="placed" name="Students Placed" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="avgPackage" name="Avg Package (LPA)" fill="#82ca9d" />
                    <Bar yAxisId="right" dataKey="highestPackage" name="Highest Package (LPA)" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Placement Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Placement Data Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border px-4 py-2 text-left">Week</th>
                        <th className="border px-4 py-2 text-left">Students Placed</th>
                        <th className="border px-4 py-2 text-left">Average Package (LPA)</th>
                        <th className="border px-4 py-2 text-left">Highest Package (LPA)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {placementData.map((data, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="border px-4 py-2">{data.week}</td>
                          <td className="border px-4 py-2">{data.placed}</td>
                          <td className="border px-4 py-2">₹{data.avgPackage.toFixed(2)}</td>
                          <td className="border px-4 py-2">₹{data.highestPackage.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Add New Data Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add Placement Data</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addPlacementData} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="week">Week Period</Label>
                    <Input 
                      id="week" 
                      name="week"
                      placeholder="e.g., Week 5, May 1-7" 
                      value={newEntry.week}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="placed">Number of Students Placed</Label>
                    <Input 
                      id="placed" 
                      name="placed"
                      type="number"
                      min="0"
                      placeholder="e.g., 15" 
                      value={newEntry.placed}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avgPackage">Average Package (LPA)</Label>
                    <Input 
                      id="avgPackage" 
                      name="avgPackage"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="e.g., 6.5" 
                      value={newEntry.avgPackage}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="highestPackage">Highest Package (LPA)</Label>
                    <Input 
                      id="highestPackage" 
                      name="highestPackage"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="e.g., 18" 
                      value={newEntry.highestPackage}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Add Data
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Placement Insights</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm">
                <p>Based on your placement data:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Placement Trend:</strong> {
                    placementData.length > 1 && placementData[placementData.length - 1].placed > placementData[placementData.length - 2].placed
                      ? "Improving" 
                      : "Needs attention"
                  }</li>
                  <li><strong>Package Trend:</strong> {
                    placementData.length > 1 && placementData[placementData.length - 1].avgPackage > placementData[placementData.length - 2].avgPackage
                      ? "Increasing" 
                      : "Stable or decreasing"
                  }</li>
                  <li><strong>Highest Package:</strong> ₹{overallHighestPackage.toFixed(2)} LPA was the best offer received</li>
                </ul>
                <p>Continue tracking data weekly for better insights.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlacementAnalytics;
