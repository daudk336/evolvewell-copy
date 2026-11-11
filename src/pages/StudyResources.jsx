import React, { useState, useEffect } from "react";
import { StudyResource } from "@/entities/StudyResource";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, ExternalLink, Star, Search, Filter, Trash2, FileText } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { UploadFile } from "@/integrations/Core";

const resourceTypeIcons = {
  notes: "📝",
  video: "🎥",
  practice_test: "✍️",
  textbook: "📚",
  article: "📄",
  website: "🌐",
  flashcards: "🃏",
  other: "📎"
};

const resourceTypeColors = {
  notes: "bg-blue-100 text-blue-700",
  video: "bg-red-100 text-red-700",
  practice_test: "bg-purple-100 text-purple-700",
  textbook: "bg-green-100 text-green-700",
  article: "bg-amber-100 text-amber-700",
  website: "bg-cyan-100 text-cyan-700",
  flashcards: "bg-pink-100 text-pink-700",
  other: "bg-gray-100 text-gray-700"
};

export default function StudyResourcesPage() {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    resource_type: "notes",
    url: "",
    file_url: "",
    tags: [],
    exam_date: "",
    rating: 0,
    notes: ""
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    const data = await StudyResource.list("-created_date");
    setResources(data);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData({ ...formData, file_url });
    } catch (error) {
      alert("Failed to upload file");
    }
    setUploadingFile(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await StudyResource.create({
      ...formData,
      rating: formData.rating || null
    });
    setShowForm(false);
    setFormData({
      title: "",
      description: "",
      subject: "",
      resource_type: "notes",
      url: "",
      file_url: "",
      tags: [],
      exam_date: "",
      rating: 0,
      notes: ""
    });
    loadResources();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const deleteResource = async (id) => {
    await StudyResource.delete(id);
    loadResources();
  };

  const subjects = [...new Set(resources.map(r => r.subject))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = filterSubject === "all" || resource.subject === filterSubject;
    const matchesType = filterType === "all" || resource.resource_type === filterType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const groupedBySubject = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.subject]) {
      acc[resource.subject] = [];
    }
    acc[resource.subject].push(resource);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Study Resources
            </h1>
            <p className="text-gray-600">Organize all your study materials in one place</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Resource
          </Button>
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resources, tags..."
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="notes">Notes</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="practice_test">Practice Test</SelectItem>
                    <SelectItem value="textbook">Textbook</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="flashcards">Flashcards</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <CardTitle>Add Study Resource</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Resource Title</Label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Chapter 5 Notes"
                          required
                        />
                      </div>

                      <div>
                        <Label>Subject/Course</Label>
                        <Input
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="e.g., Biology 101"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="What does this resource cover?"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Resource Type</Label>
                        <Select
                          value={formData.resource_type}
                          onValueChange={(value) => setFormData({ ...formData, resource_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="notes">📝 Notes</SelectItem>
                            <SelectItem value="video">🎥 Video</SelectItem>
                            <SelectItem value="practice_test">✍️ Practice Test</SelectItem>
                            <SelectItem value="textbook">📚 Textbook</SelectItem>
                            <SelectItem value="article">📄 Article</SelectItem>
                            <SelectItem value="website">🌐 Website</SelectItem>
                            <SelectItem value="flashcards">🃏 Flashcards</SelectItem>
                            <SelectItem value="other">📎 Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Exam/Test Date (optional)</Label>
                        <Input
                          type="date"
                          value={formData.exam_date}
                          onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>URL Link (optional)</Label>
                      <Input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <Label>Upload File (optional)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          onChange={handleFileUpload}
                          disabled={uploadingFile}
                          className="flex-1"
                        />
                        {uploadingFile && <span className="text-sm text-gray-500">Uploading...</span>}
                        {formData.file_url && (
                          <Badge className="bg-green-100 text-green-700">
                            ✓ Uploaded
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="e.g., midterm, chapter3"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag} variant="outline">
                          Add
                        </Button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="gap-2">
                              {tag}
                              <button type="button" onClick={() => removeTag(tag)}>×</button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Personal Notes (optional)</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Your thoughts about this resource..."
                      />
                    </div>

                    <div>
                      <Label>Rating (optional)</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating: star })}
                            className="text-2xl"
                          >
                            {star <= formData.rating ? '⭐' : '☆'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-500">
                        Add Resource
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredResources.length === 0 ? (
          <Card className="border-none shadow-lg">
            <CardContent className="py-20 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No resources found. Add your study materials to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedBySubject).map(([subject, subjectResources]) => (
              <Card key={subject} className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {subject}
                    <Badge variant="outline" className="ml-2">
                      {subjectResources.length} resource{subjectResources.length !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {subjectResources.map(resource => (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{resourceTypeIcons[resource.resource_type]}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteResource(resource.id)}
                                className="text-red-500 hover:text-red-700 flex-shrink-0 -mt-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <Badge className={`${resourceTypeColors[resource.resource_type]} mb-2`}>
                              {resource.resource_type.replace(/_/g, ' ')}
                            </Badge>

                            {resource.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{resource.description}</p>
                            )}

                            {resource.rating > 0 && (
                              <div className="flex items-center gap-1 mb-2">
                                {Array.from({ length: resource.rating }).map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            )}

                            {resource.tags && resource.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {resource.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {resource.exam_date && (
                              <p className="text-xs text-gray-500 mb-2">
                                📅 Exam: {format(new Date(resource.exam_date), "MMM d, yyyy")}
                              </p>
                            )}

                            {resource.notes && (
                              <p className="text-xs text-gray-500 italic mb-3">{resource.notes}</p>
                            )}

                            <div className="flex gap-2">
                              {resource.url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(resource.url, '_blank')}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Open Link
                                </Button>
                              )}
                              {resource.file_url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(resource.file_url, '_blank')}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <FileText className="w-4 h-4 mr-1" />
                                  View File
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}