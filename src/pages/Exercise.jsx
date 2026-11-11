import React, { useState, useEffect } from "react";
import { Exercise } from "@/entities/Exercise";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, Plus, Trash2, Calendar, Clock, Flame } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const exerciseIcons = {
  cardio: "🏃",
  strength: "💪",
  yoga: "🧘",
  sports: "⚽",
  walking: "🚶",
  cycling: "🚴",
  swimming: "🏊",
  other: "🏋️"
};

export default function ExercisePage() {
  const [exercises, setExercises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "cardio",
    duration: "",
    intensity: "moderate",
    calories: "",
    notes: "",
    date: format(new Date(), "yyyy-MM-dd")
  });

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    const data = await Exercise.list("-date", 50);
    setExercises(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await Exercise.create({
      ...formData,
      duration: parseFloat(formData.duration),
      calories: formData.calories ? parseFloat(formData.calories) : null
    });
    setShowForm(false);
    setFormData({
      type: "cardio",
      duration: "",
      intensity: "moderate",
      calories: "",
      notes: "",
      date: format(new Date(), "yyyy-MM-dd")
    });
    loadExercises();
  };

  const deleteExercise = async (id) => {
    await Exercise.delete(id);
    loadExercises();
  };

  const totalMinutes = exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
  const totalCalories = exercises.reduce((sum, ex) => sum + (ex.calories || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              Exercise Tracker
            </h1>
            <p className="text-gray-600">Track your workouts and stay active</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Log Workout
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm mb-1">Total Workouts</p>
                  <h3 className="text-4xl font-bold">{exercises.length}</h3>
                </div>
                <Dumbbell className="w-12 h-12 text-orange-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Minutes</p>
                  <h3 className="text-4xl font-bold text-gray-900">{totalMinutes}</h3>
                </div>
                <Clock className="w-12 h-12 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Calories Burned</p>
                  <h3 className="text-4xl font-bold text-gray-900">{Math.round(totalCalories)}</h3>
                </div>
                <Flame className="w-12 h-12 text-red-500" />
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
                  <CardTitle>Log New Workout</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Exercise Type</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) => setFormData({ ...formData, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cardio">🏃 Cardio</SelectItem>
                            <SelectItem value="strength">💪 Strength Training</SelectItem>
                            <SelectItem value="yoga">🧘 Yoga</SelectItem>
                            <SelectItem value="sports">⚽ Sports</SelectItem>
                            <SelectItem value="walking">🚶 Walking</SelectItem>
                            <SelectItem value="cycling">🚴 Cycling</SelectItem>
                            <SelectItem value="swimming">🏊 Swimming</SelectItem>
                            <SelectItem value="other">🏋️ Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label>Intensity</Label>
                        <Select
                          value={formData.intensity}
                          onValueChange={(value) => setFormData({ ...formData, intensity: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="intense">Intense</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Calories Burned (optional)</Label>
                        <Input
                          type="number"
                          value={formData.calories}
                          onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Notes (optional)</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="How did you feel? Any achievements?"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-orange-500 to-red-500">
                        Save Workout
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            {exercises.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                No workouts logged yet. Start tracking your fitness journey!
              </p>
            ) : (
              <div className="space-y-3">
                {exercises.map((exercise) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                  >
                    <span className="text-3xl">{exerciseIcons[exercise.type]}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {exercise.type.replace(/_/g, " ")}
                        </h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                          {exercise.intensity}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {exercise.duration} min
                        </span>
                        {exercise.calories && (
                          <span className="flex items-center gap-1">
                            <Flame className="w-4 h-4" />
                            {exercise.calories} cal
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(exercise.date), "MMM d, yyyy")}
                        </span>
                      </div>
                      {exercise.notes && (
                        <p className="text-sm text-gray-500 mt-2">{exercise.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExercise(exercise.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}