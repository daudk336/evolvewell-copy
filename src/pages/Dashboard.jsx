
import React, { useState, useEffect } from "react";
import { Exercise, MoodEntry, Assignment, Event, Goal, Reminder } from "@/entities/all";
import { Dumbbell, Heart, BookOpen, Target } from "lucide-react";
import StatsCard from "../components/dashboard/StatsCard";
import QuickActions from "../components/dashboard/QuickActions";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";
import RecentActivity from "../components/dashboard/RecentActivity";
import UpcomingReminders from "../components/dashboard/UpcomingReminders";

export default function Dashboard() {
  const [exercises, setExercises] = useState([]);
  const [moods, setMoods] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [events, setEvents] = useState([]);
  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [exerciseData, moodData, assignmentData, eventData, goalData, reminderData] = await Promise.all([
      Exercise.list("-date", 10),
      MoodEntry.list("-date", 10),
      Assignment.list("-created_date", 20),
      Event.list("-date", 20),
      Goal.list("-created_date", 10),
      Reminder.list("-remind_at", 20)
    ]);
    setExercises(exerciseData);
    setMoods(moodData);
    setAssignments(assignmentData);
    setEvents(eventData);
    setGoals(goalData);
    setReminders(reminderData);
    setIsLoading(false);
  };

  const weekExercises = exercises.filter(ex => {
    const exerciseDate = new Date(ex.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return exerciseDate >= weekAgo;
  }).length;

  const weekMinutes = exercises
    .filter(ex => {
      const exerciseDate = new Date(ex.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return exerciseDate >= weekAgo;
    })
    .reduce((sum, ex) => sum + (ex.duration || 0), 0);

  const pendingAssignments = assignments.filter(a => a.status !== 'completed').length;
  const completedGoals = goals.filter(g => g.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">Here's your wellness overview for today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Workouts This Week"
            value={weekExercises}
            subtitle={`${weekMinutes} total minutes`}
            icon={Dumbbell}
            gradient="from-orange-500 to-red-500"
            delay={0}
          />
          <StatsCard
            title="Mood Entries"
            value={moods.length}
            subtitle="Total check-ins"
            icon={Heart}
            gradient="from-emerald-500 to-teal-500"
            delay={0.1}
          />
          <StatsCard
            title="Active Assignments"
            value={pendingAssignments}
            subtitle="Need attention"
            icon={BookOpen}
            gradient="from-blue-500 to-cyan-500"
            delay={0.2}
          />
          <StatsCard
            title="Goals Completed"
            value={completedGoals}
            subtitle={`of ${goals.length} total`}
            icon={Target}
            gradient="from-yellow-500 to-amber-600"
            delay={0.3}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <RecentActivity 
              exercises={exercises}
              moods={moods}
              assignments={assignments}
            />
          </div>
          <div className="space-y-6">
            <UpcomingReminders reminders={reminders} />
            <UpcomingEvents events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
