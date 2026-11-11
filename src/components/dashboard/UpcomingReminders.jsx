import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isTomorrow } from "date-fns";

const priorityColors = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700"
};

export default function UpcomingReminders({ reminders }) {
  const upcoming = reminders
    .filter(r => !r.completed && new Date(r.remind_at) >= new Date())
    .sort((a, b) => new Date(a.remind_at) - new Date(b.remind_at))
    .slice(0, 5);

  const getDateLabel = (date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d");
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Upcoming Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No upcoming reminders</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((reminder) => {
              const reminderDate = new Date(reminder.remind_at);
              return (
                <div
                  key={reminder.id}
                  className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{reminder.title}</h4>
                    <Badge className={priorityColors[reminder.priority]}>
                      {reminder.priority}
                    </Badge>
                  </div>
                  {reminder.description && (
                    <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{getDateLabel(reminderDate)}</span>
                    <span>at {format(reminderDate, "h:mm a")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}