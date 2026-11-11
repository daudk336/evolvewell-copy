import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Dumbbell, Heart, BookOpen, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const actions = [
  { title: "Log Exercise", icon: Dumbbell, page: "Exercise", gradient: "from-orange-500 to-red-500" },
  { title: "Mood Check", icon: Heart, page: "MentalHealth", gradient: "from-emerald-500 to-teal-500" },
  { title: "Add Assignment", icon: BookOpen, page: "Assignments", gradient: "from-blue-500 to-cyan-500" },
  { title: "New Event", icon: Calendar, page: "Events", gradient: "from-violet-500 to-purple-500" }
];

export default function QuickActions() {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link key={index} to={createPageUrl(action.page)}>
              <Button
                variant="outline"
                className={`w-full h-24 flex flex-col items-center justify-center gap-2 border-none bg-gradient-to-br ${action.gradient} bg-opacity-5 hover:bg-opacity-10 transition-all group`}
              >
                <action.icon className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{action.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}