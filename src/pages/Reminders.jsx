import React, { useState, useEffect } from "react";
import { Reminder } from "@/entities/Reminder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Plus, Check, Clock, AlertCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const typeColors = {
  assignment: "from-blue-500 to-cyan-500",
  event: "from-violet-500 to-purple-500",
  goal: "from-yellow-500 to-amber-600",
  routine: "from-pink-500 to-rose-500",
  custom: "from-gray-500 to-gray-600"
};

const priorityColors = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700"
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    remind_at: "",
    reminder_type: "custom",
    priority: "medium",
    repeat: "none"
  });

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    const data = await Reminder.list("-remind_at");
    setReminders(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await Reminder.create(formData);
    setShowForm(false);
    setFormData({
      title: "",
      description: "",
      remind_at: "",
      reminder_type: "custom",
      priority: "medium",
      repeat: "none"
    });
    loadReminders();
  };

  const toggleComplete = async (reminder) => {
    await Reminder.update(reminder.id, {
      ...reminder,
      completed: !reminder.completed
    });
    loadReminders();
  };

  const deleteReminder = async (id) => {
    await Reminder.delete(id);
    loadReminders();
  };

  const upcoming = reminders.filter(r => !r.completed && new Date(r.remind_at) >= new Date());
  const past = reminders.filter(r => !r.completed && new Date(r.remind_at) < new Date());
  const completed = reminders.filter(r => r.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Reminders
            </h1>
            <p className="text-gray-600">Never miss an important task or deadline</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Reminder
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Upcoming</p>
                  <h3 className="text-4xl font-bold text-gray-900">{upcoming.length}</h3>
                </div>
                <Clock className="w-12 h-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Overdue</p>
                  <h3 className="text-4xl font-bold text-gray-900">{past.length}</h3>
                </div>
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Completed</p>
                  <h3 className="text-4xl font-bold text-gray-900">{completed.length}</h3>
                </div>
                <Check className="w-12 h-12 text-green-500" />
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
                  <CardTitle>Create New Reminder</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label>What should we remind you about?</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Study for Math exam"
                        required
                      />
                    </div>

                    <div>
                      <Label>Additional Details (optional)</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Any specific notes..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Remind Me On</Label>
                        <Input
                          type="datetime-local"
                          value={formData.remind_at}
                          onChange={(e) => setFormData({ ...formData, remind_at: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label>Type</Label>
                        <Select
                          value={formData.reminder_type}
                          onValueChange={(value) => setFormData({ ...formData, reminder_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="custom">Custom</SelectItem>
                            <SelectItem value="assignment">Assignment</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="goal">Goal</SelectItem>
                            <SelectItem value="routine">Routine</SelectItem>
                          </SelectContent>
                        </Select>
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
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Repeat</Label>
                        <Select
                          value={formData.repeat}
                          onValueChange={(value) => setFormData({ ...formData, repeat: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Repeat</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-rose-500 to-purple-500">
                        Create Reminder
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {past.length > 0 && (
          <Card className="border-none shadow-lg border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                Overdue Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {past.map(reminder => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onToggle={toggleComplete}
                    onDelete={deleteReminder}
                    isOverdue
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                No upcoming reminders. Create one to stay organized!
              </p>
            ) : (
              <div className="space-y-3">
                {upcoming.map(reminder => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onToggle={toggleComplete}
                    onDelete={deleteReminder}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {completed.length > 0 && (
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completed.map(reminder => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onToggle={toggleComplete}
                    onDelete={deleteReminder}
                    isCompleted
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ReminderCard({ reminder, onToggle, onDelete, isOverdue, isCompleted }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-4 rounded-xl border transition-all hover:shadow-md ${
        isOverdue ? 'bg-red-50 border-red-200' :
        isCompleted ? 'bg-gray-50 border-gray-200 opacity-60' :
        'border-gray-100'
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(reminder)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-purple-500'
          }`}
        >
          {isCompleted && <Check className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className={`font-semibold text-gray-900 ${isCompleted ? 'line-through' : ''}`}>
              {reminder.title}
            </h4>
            <Badge className={priorityColors[reminder.priority]}>
              {reminder.priority}
            </Badge>
          </div>

          {reminder.description && (
            <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
              <Bell className="w-4 h-4" />
              {format(new Date(reminder.remind_at), "MMM d, yyyy 'at' h:mm a")}
            </span>
            
            <Badge variant="outline" className={`bg-gradient-to-r ${typeColors[reminder.reminder_type]} text-white border-none`}>
              {reminder.reminder_type}
            </Badge>

            {reminder.repeat !== 'none' && (
              <Badge variant="outline">
                Repeats {reminder.repeat}
              </Badge>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(reminder.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}