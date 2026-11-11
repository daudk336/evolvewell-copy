import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { format } from "date-fns";

export default function RecentActivity({ exercises, moods, assignments }) {
  const activities = [];

  exercises.forEach(ex => {
    activities.push({
      type: 'exercise',
      title: `${ex.type} workout`,
      subtitle: `${ex.duration} minutes`,
      date: ex.date,
      icon: '🏃',
      color: 'text-orange-600'
    });
  });

  moods.forEach(mood => {
    activities.push({
      type: 'mood',
      title: 'Mood check-in',
      subtitle: mood.mood,
      date: mood.date,
      icon: '💚',
      color: 'text-emerald-600'
    });
  });

  assignments.filter(a => a.status === 'completed').forEach(assignment => {
    activities.push({
      type: 'assignment',
      title: assignment.title,
      subtitle: 'Completed',
      date: assignment.updated_date,
      icon: '✅',
      color: 'text-blue-600'
    });
  });

  const sortedActivities = activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedActivities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {sortedActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.subtitle}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {format(new Date(activity.date), "MMM d")}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}