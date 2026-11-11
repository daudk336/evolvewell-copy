import React, { useState, useEffect } from "react";
import { RoutineTemplate, UserRoutine } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, Play, CheckCircle2, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const categoryColors = {
  morning: "from-amber-500 to-orange-500",
  evening: "from-indigo-500 to-purple-500",
  study: "from-blue-500 to-cyan-500",
  exercise: "from-red-500 to-pink-500",
  self_care: "from-emerald-500 to-teal-500",
  productivity: "from-violet-500 to-purple-500",
  creative: "from-pink-500 to-rose-500"
};

const difficultyColors = {
  easy: "bg-green-100 text-green-700",
  moderate: "bg-yellow-100 text-yellow-700",
  challenging: "bg-red-100 text-red-700"
};

export default function RoutinesPage() {
  const [templates, setTemplates] = useState([]);
  const [userRoutines, setUserRoutines] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    scheduled_time: "",
    date: format(new Date(), "yyyy-MM-dd"),
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [templatesData, routinesData] = await Promise.all([
      RoutineTemplate.list("-created_date"),
      UserRoutine.list("-date", 50)
    ]);
    setTemplates(templatesData);
    setUserRoutines(routinesData);
  };

  const handleApplyTemplate = (template) => {
    setSelectedTemplate(template);
    setShowScheduleDialog(true);
  };

  const scheduleRoutine = async () => {
    await UserRoutine.create({
      template_name: selectedTemplate.name,
      category: selectedTemplate.category,
      scheduled_time: scheduleData.scheduled_time,
      date: scheduleData.date,
      tasks: selectedTemplate.tasks?.map(task => ({
        title: task.title,
        duration: task.duration,
        completed: false
      })) || [],
      completed: false,
      notes: scheduleData.notes
    });
    setShowScheduleDialog(false);
    setScheduleData({
      scheduled_time: "",
      date: format(new Date(), "yyyy-MM-dd"),
      notes: ""
    });
    loadData();
  };

  const toggleTaskComplete = async (routine, taskIndex) => {
    const updatedTasks = [...routine.tasks];
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;
    
    const allCompleted = updatedTasks.every(task => task.completed);
    
    await UserRoutine.update(routine.id, {
      ...routine,
      tasks: updatedTasks,
      completed: allCompleted
    });
    loadData();
  };

  const todayRoutines = userRoutines.filter(r => r.date === format(new Date(), "yyyy-MM-dd"));
  const upcomingRoutines = userRoutines.filter(r => new Date(r.date) > new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
            Routine Templates
          </h1>
          <p className="text-gray-600">
            Start small, build momentum. These templates make it easy to begin—perfect for beating procrastination! 💪
          </p>
        </div>

        {todayRoutines.length > 0 && (
          <Card className="border-none shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5" />
                Today's Routines ({todayRoutines.filter(r => !r.completed).length} remaining)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {todayRoutines.map(routine => (
                  <div key={routine.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{routine.template_name}</h4>
                      {routine.completed && <CheckCircle2 className="w-5 h-5" />}
                    </div>
                    <div className="space-y-2">
                      {routine.tasks?.map((task, idx) => (
                        <div
                          key={idx}
                          onClick={() => toggleTaskComplete(routine, idx)}
                          className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            task.completed ? 'bg-white border-white' : 'border-white'
                          }`}>
                            {task.completed && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                          </div>
                          <span className={task.completed ? 'line-through opacity-75' : ''}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse Templates</h2>
          <p className="text-gray-600 mb-6">
            Choose a template that resonates with you. Remember: starting is the hardest part, but you've got this! 🌟
          </p>
          
          {templates.length === 0 ? (
            <Card className="border-none shadow-lg">
              <CardContent className="py-12 text-center">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Loading inspiring routines...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-none shadow-lg hover:shadow-xl transition-all h-full flex flex-col group">
                    <div className={`h-2 bg-gradient-to-r ${categoryColors[template.category]}`} />
                    
                    {template.thumbnail && (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {template.video_url && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              size="sm"
                              className="bg-white text-gray-900 hover:bg-gray-100"
                              onClick={() => window.open(template.video_url, '_blank')}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Watch Video
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge className={difficultyColors[template.difficulty]}>
                          {template.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <div className="space-y-3 mb-4">
                        {template.duration && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {template.duration}
                          </div>
                        )}
                        
                        {template.time_of_day && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {template.time_of_day}
                          </div>
                        )}
                      </div>

                      {template.tips_for_procrastinators && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                          <p className="text-xs font-semibold text-amber-800 mb-1">💡 Pro Tip:</p>
                          <p className="text-xs text-amber-700">{template.tips_for_procrastinators}</p>
                        </div>
                      )}

                      {template.benefits && template.benefits.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Benefits:</p>
                          <div className="space-y-1">
                            {template.benefits.slice(0, 3).map((benefit, idx) => (
                              <p key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                <span className="text-green-500">✓</span>
                                {benefit}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={() => handleApplyTemplate(template)}
                        className={`w-full mt-auto bg-gradient-to-r ${categoryColors[template.category]} hover:opacity-90 text-white`}
                      >
                        Use This Template
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {upcomingRoutines.length > 0 && (
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Upcoming Scheduled Routines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingRoutines.map(routine => (
                  <div key={routine.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{routine.template_name}</h4>
                      <span className="text-sm text-gray-600">
                        {format(new Date(routine.date), "MMM d, yyyy")}
                      </span>
                    </div>
                    {routine.scheduled_time && (
                      <p className="text-sm text-gray-600">at {routine.scheduled_time}</p>
                    )}
                    {routine.notes && (
                      <p className="text-sm text-gray-500 mt-2">{routine.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule: {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-3">{selectedTemplate.description}</p>
                {selectedTemplate.tips_for_procrastinators && (
                  <div className="bg-white/80 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-purple-700 mb-1">💪 Remember:</p>
                    <p className="text-xs text-gray-700">{selectedTemplate.tips_for_procrastinators}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="font-semibold mb-3">Routine Steps:</p>
                <div className="space-y-2">
                  {selectedTemplate.tasks?.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-semibold">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{task.title}</p>
                        {task.duration && (
                          <p className="text-xs text-gray-600">{task.duration}</p>
                        )}
                        {task.description && (
                          <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label>When? (Date)</Label>
                  <Input
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>What time? (Optional)</Label>
                  <Input
                    type="time"
                    value={scheduleData.scheduled_time}
                    onChange={(e) => setScheduleData({ ...scheduleData, scheduled_time: e.target.value })}
                    className="mt-1"
                    placeholder="e.g., 7:00 AM"
                  />
                </div>

                <div>
                  <Label>Personal Notes (Optional)</Label>
                  <Textarea
                    value={scheduleData.notes}
                    onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                    placeholder="Any modifications or reminders for yourself?"
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                onClick={scheduleRoutine}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Schedule This Routine
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}