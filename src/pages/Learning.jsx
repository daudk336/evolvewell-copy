import React, { useState, useEffect } from "react";
import { Tutorial } from "@/entities/Tutorial";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, Play, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categoryColors = {
  exercise: "bg-orange-100 text-orange-700",
  mental_health: "bg-emerald-100 text-emerald-700",
  productivity: "bg-blue-100 text-blue-700",
  study_skills: "bg-purple-100 text-purple-700",
  wellness: "bg-green-100 text-green-700",
  technology: "bg-cyan-100 text-cyan-700",
  life_skills: "bg-pink-100 text-pink-700"
};

export default function LearningPage() {
  const [tutorials, setTutorials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadTutorials();
  }, []);

  const loadTutorials = async () => {
    const data = await Tutorial.list("-created_date");
    setTutorials(data);
  };

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Learning Center
          </h1>
          <p className="text-gray-600">Explore helpful tutorials and resources</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tutorials..."
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="exercise">Exercise</SelectItem>
                    <SelectItem value="mental_health">Mental Health</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="study_skills">Study Skills</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="life_skills">Life Skills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredTutorials.length === 0 ? (
          <Card className="border-none shadow-lg">
            <CardContent className="py-20 text-center">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No tutorials available yet. Check back soon for helpful content!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map(tutorial => (
              <Card key={tutorial.id} className="border-none shadow-lg hover:shadow-xl transition-all overflow-hidden group">
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {tutorial.thumbnail ? (
                    <img
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <Button
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 hover:bg-gray-100"
                      onClick={() => window.open(tutorial.video_url, '_blank')}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Watch Now
                    </Button>
                  </div>
                  {tutorial.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {tutorial.duration}
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg line-clamp-2">{tutorial.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={categoryColors[tutorial.category] || "bg-gray-100 text-gray-700"}>
                      {tutorial.category?.replace(/_/g, ' ')}
                    </Badge>
                    {tutorial.difficulty && (
                      <Badge variant="outline">
                        {tutorial.difficulty}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {tutorial.description || "No description available"}
                  </p>
                  {tutorial.views > 0 && (
                    <p className="text-xs text-gray-400 mt-3">
                      {tutorial.views} views
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}