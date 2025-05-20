
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

// Mock student data
const mockStudents = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    skills: ["React", "JavaScript", "Node.js"],
    cgpa: "8.7"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    skills: ["Python", "Machine Learning", "Data Science"],
    cgpa: "9.2"
  },
  {
    id: "3",
    name: "Sam Wilson",
    email: "sam@example.com",
    skills: ["Java", "Spring Boot", "MySQL"],
    cgpa: "8.5"
  },
  {
    id: "4",
    name: "Alex Johnson",
    email: "alex@example.com",
    skills: ["React", "TypeScript", "AWS"],
    cgpa: "8.9"
  },
  {
    id: "5",
    name: "Maria Garcia",
    email: "maria@example.com",
    skills: ["Python", "Django", "JavaScript"],
    cgpa: "9.0"
  }
];

const SearchStudents = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // Filter students based on search term
  const filteredStudents = mockStudents.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search by name, email, skills
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  });

  const viewStudentProfile = (student: any) => {
    setSelectedStudent(student);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700 mb-4 md:mb-0">Search Students</h1>
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
        <div className="max-w-5xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Find Students by Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by skill, name, or email..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student List */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {searchTerm ? "Search Results" : "All Students"}
              </h2>
              
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <Card 
                    key={student.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => viewStudentProfile(student)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-indigo-700">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {student.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-indigo-50 text-indigo-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-700">CGPA: {student.cgpa}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">
                    {searchTerm 
                      ? "No students matching your search criteria"
                      : "No students available"
                    }
                  </p>
                </div>
              )}
            </div>
            
            {/* Student Profile View */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Profile</h2>
              
              {selectedStudent ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4 text-center">
                      <div className="h-20 w-20 rounded-full bg-indigo-100 mx-auto mb-2 flex items-center justify-center text-indigo-700 text-xl font-bold">
                        {selectedStudent.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                      <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">CGPA</h4>
                        <p className="font-medium">{selectedStudent.cgpa}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Skills</h4>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedStudent.skills.map((skill: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="bg-indigo-50 text-indigo-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                          View Full Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">Select a student to view their profile</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchStudents;
