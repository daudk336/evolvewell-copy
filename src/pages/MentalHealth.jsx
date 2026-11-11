import React, { useState, useEffect } from "react";
import { MoodEntry } from "@/entities/MoodEntry";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Plus, Smile, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const moodEmojis = {
  amazing: { emoji: "😄", label: "Amazing", color: "from-green-500 to-emerald-500" },
  good: { emoji: "😊", label: "Good", color: "from-blue-500 to-cyan-500" },
  okay: { emoji: "😐", label: "Okay", color: "from-yellow-500 to-amber-500" },
  low: { emoji: "😔", label: "Low", color: "from-orange-500 to-red-500" },
  struggling: { emoji: "😢", label: "Struggling", color: "from-red-500 to-pink-500" }
};

export default function MentalHealthPage() {
  const [moods, setMoods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mood: "good",
    energy_level: 5,
    activities: [],
    gratitude: "",
    reflection: "",
    date: format(new Date(), "yyyy-MM-dd")
  });
  const [activityInput, setActivityInput] = useState("");

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    const data = await MoodEntry.list("-date", 50);
    setMoods(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await MoodEntry.create({
      ...formData,
      energy_level: parseInt(formData.energy_level)
    });
    setShowForm(false);
    setFormData({
      mood: "good",
      energy_level: 5,
      activities: [],
      gratitude: "",
      reflection: "",
      date: format(new Date(), "yyyy-MM-dd")
    });
    loadMoods();
  };

  const addActivity = () => {
    if (activityInput.trim()) {
      setFormData({
        ...formData,
        activities: [...formData.activities, activityInput.trim()]
      });
      setActivityInput("");
    }
  };

  const removeActivity = (index) => {
    setFormData({
      ...formData,
      activities: formData.activities.filter((_, i) => i !== index)
    });
  };

  const avgEnergy = moods.length > 0
    ? (moods.reduce((sum, m) => sum + m.energy_level, 0) / moods.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Mental Health Journal
            </h1>
            <p className="text-gray-600">Track your mood and emotional wellness</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Entry
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm mb-1">Total Entries</p>
                  <h3 className="text-4xl font-bold">{moods.length}</h3>
                </div>
                <Heart className="w-12 h-12 text-emerald-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Avg Energy</p>
                  <h3 className="text-4xl font-bold text-gray-900">{avgEnergy}/10</h3>
                </div>
                <TrendingUp className="w-12 h-12 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Current Streak</p>
                  <h3 className="text-4xl font-bold text-gray-900">
                    {moods.length > 0 ? Math.min(7, moods.length) : 0}
                  </h3>
                  <p className="text-xs text-gray-500">days</p>
                </div>
                <Smile className="w-12 h-12 text-yellow-500" />
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
                  <CardTitle>How are you feeling today?</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label className="mb-4 block">Choose your mood</Label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {Object.entries(moodEmojis).map(([key, { emoji, label, color }]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setFormData({ ...formData, mood: key })}
                            className={`p-4 rounded-2xl border-2 transition-all ${
                              formData.mood === key
                                ? `bg-gradient-to-br ${color} text-white border-transparent shadow-lg scale-105`
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="text-4xl mb-2">{emoji}</div>
                            <div className={`text-sm font-medium ${formData.mood === key ? "text-white" : "text-gray-700"}`}>
                              {label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Energy Level: {formData.energy_level}/10</Label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.energy_level}
                        onChange={(e) => setFormData({ ...formData, energy_level: e.target.value })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div>
                      <Label>Activities that affected your mood</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={activityInput}
                          onChange={(e) => setActivityInput(e.target.value)}
                          placeholder="e.g., Exercise, Work, Friends"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addActivity())}
                        />
                        <Button type="button" onClick={addActivity}>Add</Button>
                      </div>
                      {formData.activities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.activities.map((activity, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm flex items-center gap-2"
                            >
                              {activity}
                              <button type="button" onClick={() => removeActivity(index)}>×</button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>What are you grateful for today?</Label>
                      <Textarea
                        value={formData.gratitude}
                        onChange={(e) => setFormData({ ...formData, gratitude: e.target.value })}
                        placeholder="Write something you're thankful for..."
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Daily Reflection</Label>
                      <Textarea
                        value={formData.reflection}
                        onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                        placeholder="How was your day? Any thoughts or feelings to note?"
                        className="mt-2 h-24"
                      />
                    </div>

                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-500">
                        Save Entry
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
            <CardTitle>Your Journey</CardTitle>
          </CardHeader>
          <CardContent>
            {moods.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                Start your mental health journey by logging your first mood entry!
              </p>
            ) : (
              <div className="space-y-4">
                {moods.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${moodEmojis[entry.mood].color} flex items-center justify-center text-3xl shadow-lg`}>
                        {moodEmojis[entry.mood].emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-lg text-gray-900">
                            {moodEmojis[entry.mood].label}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {format(new Date(entry.date), "MMM d, yyyy")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Energy Level: {entry.energy_level}/10
                        </p>
                        {entry.activities && entry.activities.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {entry.activities.map((activity, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {activity}
                              </span>
                            ))}
                          </div>
                        )}
                        {entry.gratitude && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700">Grateful for:</p>
                            <p className="text-sm text-gray-600">{entry.gratitude}</p>
                          </div>
                        )}
                        {entry.reflection && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Reflection:</p>
                            <p className="text-sm text-gray-600">{entry.reflection}</p>
                          </div>
                        )}
                      </div>
                    </div>
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