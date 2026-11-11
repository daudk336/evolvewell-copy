import React, { useState, useEffect } from "react";
import { Goal, Achievement } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Plus, Target, Award, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const categoryGradients = {
  exercise: "from-orange-500 to-red-500",
  mental_health: "from-emerald-500 to-teal-500",
  learning: "from-purple-500 to-pink-500",
  productivity: "from-blue-500 to-cyan-500",
  personal: "from-indigo-500 to-purple-500",
  other: "from-gray-500 to-gray-600"
};

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalFormData, setGoalFormData] = useState({
    title: "",
    description: "",
    category: "personal",
    target_value: "",
    current_value: 0,
    unit: "",
    deadline: "",
    frequency: "one_time"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [goalData, achievementData] = await Promise.all([
      Goal.list("-created_date"),
      Achievement.list("-earned_date")
    ]);
    setGoals(goalData);
    setAchievements(achievementData);
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    await Goal.create({
      ...goalFormData,
      target_value: parseFloat(goalFormData.target_value),
      current_value: parseFloat(goalFormData.current_value)
    });
    setShowGoalForm(false);
    setGoalFormData({
      title: "",
      description: "",
      category: "personal",
      target_value: "",
      current_value: 0,
      unit: "",
      deadline: "",
      frequency: "one_time"
    });
    loadData();
  };

  const updateGoalProgress = async (goal, newValue) => {
    const completed = newValue >= goal.target_value;
    await Goal.update(goal.id, {
      ...goal,
      current_value: newValue,
      completed
    });
    loadData();
  };

  const totalPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + (a.points || 0), 0);
  const completedGoals = goals.filter(g => g.completed).length;
  const earnedBadges = achievements.filter(a => a.earned).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Goals & Achievements
            </h1>
            <p className="text-gray-600">Track your progress and celebrate wins</p>
          </div>
          <Button
            onClick={() => setShowGoalForm(!showGoalForm)}
            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Goal
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-500 to-amber-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm mb-1">Total Points</p>
                  <h3 className="text-4xl font-bold">{totalPoints}</h3>
                </div>
                <Sparkles className="w-12 h-12 text-yellow-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Goals Completed</p>
                  <h3 className="text-4xl font-bold text-gray-900">{completedGoals}</h3>
                  <p className="text-sm text-gray-500">of {goals.length} total</p>
                </div>
                <Target className="w-12 h-12 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Badges Earned</p>
                  <h3 className="text-4xl font-bold text-gray-900">{earnedBadges}</h3>
                  <p className="text-sm text-gray-500">of {achievements.length} total</p>
                </div>
                <Award className="w-12 h-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <AnimatePresence>
          {showGoalForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <CardTitle>Create New Goal</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGoalSubmit} className="space-y-4">
                    <div>
                      <Label>Goal Title</Label>
                      <Input
                        value={goalFormData.title}
                        onChange={(e) => setGoalFormData({ ...goalFormData, title: e.target.value })}
                        placeholder="e.g., Exercise 3 times per week"
                        required
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={goalFormData.description}
                        onChange={(e) => setGoalFormData({ ...goalFormData, description: e.target.value })}
                        placeholder="Why is this goal important?"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Category</Label>
                        <Select
                          value={goalFormData.category}
                          onValueChange={(value) => setGoalFormData({ ...goalFormData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="exercise">Exercise</SelectItem>
                            <SelectItem value="mental_health">Mental Health</SelectItem>
                            <SelectItem value="learning">Learning</SelectItem>
                            <SelectItem value="productivity">Productivity</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Frequency</Label>
                        <Select
                          value={goalFormData.frequency}
                          onValueChange={(value) => setGoalFormData({ ...goalFormData, frequency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                            <SelectItem value="one_time">One Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Target Value</Label>
                        <Input
                          type="number"
                          value={goalFormData.target_value}
                          onChange={(e) => setGoalFormData({ ...goalFormData, target_value: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label>Unit</Label>
                        <Input
                          value={goalFormData.unit}
                          onChange={(e) => setGoalFormData({ ...goalFormData, unit: e.target.value })}
                          placeholder="e.g., times, hours, days"
                          required
                        />
                      </div>

                      <div>
                        <Label>Deadline (optional)</Label>
                        <Input
                          type="date"
                          value={goalFormData.deadline}
                          onChange={(e) => setGoalFormData({ ...goalFormData, deadline: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setShowGoalForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-yellow-500 to-amber-600">
                        Create Goal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Active Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {goals.length === 0 ? (
                  <p className="text-center text-gray-500 py-12">
                    No goals yet. Create your first goal to start tracking!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {goals.map(goal => {
                      const progress = (goal.current_value / goal.target_value) * 100;
                      return (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-lg text-gray-900">{goal.title}</h4>
                                {goal.completed && (
                                  <Badge className="bg-green-100 text-green-700">
                                    ✓ Completed
                                  </Badge>
                                )}
                              </div>
                              {goal.description && (
                                <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-semibold">
                                {goal.current_value} / {goal.target_value} {goal.unit}
                              </span>
                            </div>
                            <Progress value={Math.min(progress, 100)} className="h-3" />

                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <Badge variant="outline" className={`bg-gradient-to-r ${categoryGradients[goal.category]} text-white border-none`}>
                                {goal.category?.replace(/_/g, ' ')}
                              </Badge>
                              <span className="text-gray-600">
                                {goal.frequency?.replace(/_/g, ' ')}
                              </span>
                              {goal.deadline && (
                                <span className="text-gray-600">
                                  Deadline: {format(new Date(goal.deadline), "MMM d, yyyy")}
                                </span>
                              )}
                            </div>

                            {!goal.completed && (
                              <div className="flex gap-2 mt-4">
                                <Input
                                  type="number"
                                  placeholder="Update progress"
                                  className="max-w-32"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      updateGoalProgress(goal, parseFloat(e.target.value));
                                      e.target.value = '';
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    const input = e.target.closest('div').querySelector('input');
                                    if (input.value) {
                                      updateGoalProgress(goal, parseFloat(input.value));
                                      input.value = '';
                                    }
                                  }}
                                >
                                  Update
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length === 0 ? (
                  <p className="text-center text-gray-500 py-12 text-sm">
                    Achievements will appear here as you progress!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {achievements.map(achievement => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-xl border transition-all ${
                          achievement.earned
                            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'
                            : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`text-3xl ${achievement.earned ? '' : 'grayscale'}`}>
                            {achievement.badge_icon || '🏆'}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-1">
                              {achievement.name}
                            </h5>
                            <p className="text-xs text-gray-600 mb-2">
                              {achievement.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {achievement.category?.replace(/_/g, ' ')}
                              </Badge>
                              {achievement.earned && (
                                <span className="text-xs text-amber-600 font-semibold">
                                  +{achievement.points} pts
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}