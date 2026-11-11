import React, { useState, useEffect } from "react";
import { Assignment } from "@/entities/Assignment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const priorityColors = {
  low: "bg-blue-100 text-blue-700 border-blue-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  urgent: "bg-red-100 text-red-700 border-red-200"
};

const statusIcons = {
  not_started: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle2
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    due_date: "",
    priority: "medium",
    status: "not_started",
    estimated_hours: ""
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    const data = await Assignment.list("-due_date");
    setAssignments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await Assignment.create({
      ...formData,
      estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null
    });
    setShowForm(false);
    setFormData({
      title: "",
      description: "",
      subject: "",
      due_date: "",
      priority: "medium",
      status: "not_started",
      estimated_hours: ""
    });
    loadAssignments();
  };

  const updateStatus = async (id, newStatus) => {
    const assignment = assignments.find(a => a.id === id);
    await Assignment.update(id, { ...assignment, status: newStatus });
    loadAssignments();
  };

  const pending = assignments.filter(a => a.status !== 'completed').length;
  const completed = assignments.filter(a => a.status === 'completed').length;
  const urgent = assignments.filter(a => a.priority === 'urgent' && a.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Assignments
            </h1>
            <p className="text-gray-600">Manage your tasks and deadlines</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Assignment
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Pending</p>
                  <h3 className="text-4xl font-bold text-gray-900">{pending}</h3>
                </div>
                <Clock className="w-12 h-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">Completed</p>
                  <h3 className="text-4xl font-bold">{completed}</h3>
                </div>
                <CheckCircle2 className="w-12 h-12 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Urgent</p>
                  <h3 className="text-4xl font-bold text-gray-900">{urgent}</h3>
                </div>
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <CardTitle>Create New Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Assignment details..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Subject/Category</Label>
                        <Input
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="Math, Science, etc."
                        />
                      </div>

                      <div>
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={formData.due_date}
                          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label>Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) => setFormData({ ...formData, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Estimated Hours</Label>
                        <Input
                          type="number"
                          step="0.5"
                          value={formData.estimated_hours}
                          onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-blue-500 to-cyan-500">
                        Create Assignment
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6">
          {['not_started', 'in_progress', 'completed'].map((status) => {
            const statusAssignments = assignments.filter(a => a.status === status);
            if (statusAssignments.length === 0) return null;

            const statusTitle = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const StatusIcon = statusIcons[status];

            return (
              <Card key={status} className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StatusIcon className="w-5 h-5" />
                    {statusTitle} ({statusAssignments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {statusAssignments.map((assignment) => (
                      <motion.div
                        key={assignment.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900 mb-1">
                              {assignment.title}
                            </h4>
                            {assignment.subject && (
                              <p className="text-sm text-gray-600 mb-2">{assignment.subject}</p>
                            )}
                          </div>
                          <Badge className={`${priorityColors[assignment.priority]} border ml-2`}>
                            {assignment.priority}
                          </Badge>
                        </div>

                        {assignment.description && (
                          <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            📅 Due: {format(new Date(assignment.due_date), "MMM d, yyyy")}
                          </span>
                          {assignment.estimated_hours && (
                            <span>⏱️ {assignment.estimated_hours}h estimated</span>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          {assignment.status !== 'not_started' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(assignment.id, 'not_started')}
                            >
                              Mark Not Started
                            </Button>
                          )}
                          {assignment.status !== 'in_progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(assignment.id, 'in_progress')}
                            >
                              Mark In Progress
                            </Button>
                          )}
                          {assignment.status !== 'completed' && (
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => updateStatus(assignment.id, 'completed')}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}