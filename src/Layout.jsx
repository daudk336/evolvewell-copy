import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import {
  LayoutDashboard,
  Dumbbell,
  Heart,
  BookOpen,
  Calendar,
  GraduationCap,
  Trophy,
  User as UserIcon,
  Sparkles,
  RefreshCw,
  Bell
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Routine Templates",
    url: createPageUrl("Routines"),
    icon: RefreshCw,
  },
  {
    title: "Exercise",
    url: createPageUrl("Exercise"),
    icon: Dumbbell,
  },
  {
    title: "Mental Health",
    url: createPageUrl("MentalHealth"),
    icon: Heart,
  },
  {
    title: "Assignments",
    url: createPageUrl("Assignments"),
    icon: BookOpen,
  },
  {
    title: "Events",
    url: createPageUrl("Events"),
    icon: Calendar,
  },
  {
    title: "Study Resources",
    url: createPageUrl("StudyResources"),
    icon: BookOpen,
  },
  {
    title: "Reminders",
    url: createPageUrl("Reminders"),
    icon: Bell,
  },
  {
    title: "Learning",
    url: createPageUrl("Learning"),
    icon: GraduationCap,
  },
  {
    title: "Goals & Achievements",
    url: createPageUrl("Goals"),
    icon: Trophy,
  }
];

const fontFamilyMap = {
  system: "",
  inter: "Inter, sans-serif",
  poppins: "Poppins, sans-serif",
  roboto: "Roboto, sans-serif",
  lora: "Lora, serif",
  playfair: "'Playfair Display', serif",
  comic_sans: "'Comic Sans MS', cursive"
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [theme, setTheme] = useState({
    mode: "light",
    primaryColor: "#6366f1",
    secondaryColor: "#a855f7",
    fontFamily: "system",
    backgroundImage: "",
    backgroundOpacity: 0.1,
    sidebarStyle: "gradient",
    cardStyle: "elevated",
    animationLevel: "full"
  });

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const user = await User.me();
      setTheme({
        mode: user.theme_mode || "light",
        primaryColor: user.primary_color || "#6366f1",
        secondaryColor: user.secondary_color || "#a855f7",
        fontFamily: user.font_family || "system",
        backgroundImage: user.background_image || "",
        backgroundOpacity: user.background_opacity ?? 0.1,
        sidebarStyle: user.sidebar_style || "gradient",
        cardStyle: user.card_style || "elevated",
        animationLevel: user.animation_level || "full"
      });
    } catch (error) {
      console.log("Using default theme");
    }
  };

  const isDark = theme.mode === "dark" || (theme.mode === "auto" && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const getGradient = () => `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`;
  
  const sidebarClass = {
    gradient: "bg-gradient-to-br from-white via-gray-50 to-white",
    solid: "bg-white",
    glass: "bg-white/60 backdrop-blur-xl"
  }[theme.sidebarStyle];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Lora:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        :root {
          --primary-color: ${theme.primaryColor};
          --secondary-color: ${theme.secondaryColor};
          --gradient: ${getGradient()};
        }
        
        * {
          ${theme.fontFamily !== "system" ? `font-family: ${fontFamilyMap[theme.fontFamily]} !important;` : ""}
        }
        
        ${isDark ? `
          body {
            background: #0f172a !important;
            color: #f1f5f9 !important;
          }
          .card, .bg-white {
            background: #1e293b !important;
            color: #f1f5f9 !important;
          }
          .text-gray-900 {
            color: #f1f5f9 !important;
          }
          .text-gray-600, .text-gray-700 {
            color: #cbd5e1 !important;
          }
          .text-gray-500 {
            color: #94a3b8 !important;
          }
          .border-gray-100, .border-gray-200 {
            border-color: #334155 !important;
          }
          .bg-gray-50 {
            background: #1e293b !important;
          }
          input, textarea, select {
            background: #334155 !important;
            color: #f1f5f9 !important;
            border-color: #475569 !important;
          }
        ` : ""}
        
        ${theme.cardStyle === "elevated" ? `
          .card {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .card:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        ` : theme.cardStyle === "outlined" ? `
          .card {
            border: 2px solid #e2e8f0;
            box-shadow: none;
          }
        ` : `
          .card {
            box-shadow: none;
          }
        `}
        
        ${theme.animationLevel === "none" ? `
          * {
            animation: none !important;
            transition: none !important;
          }
        ` : theme.animationLevel === "reduced" ? `
          * {
            animation-duration: 0.1s !important;
            transition-duration: 0.1s !important;
          }
        ` : ""}
      ` }} />
      
      <SidebarProvider>
        <div 
          className={`min-h-screen flex w-full ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'}`}
          style={{
            position: 'relative'
          }}
        >
          {theme.backgroundImage && (
            <div 
              className="fixed inset-0 bg-cover bg-center pointer-events-none"
              style={{
                backgroundImage: `url(${theme.backgroundImage})`,
                opacity: theme.backgroundOpacity,
                zIndex: 0
              }}
            />
          )}
          
          <Sidebar className={`border-r ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-gray-100'} ${sidebarClass} backdrop-blur-xl relative z-10`}>
            <SidebarHeader className={`border-b ${isDark ? 'border-slate-700' : 'border-gray-100'} p-6`}>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: getGradient() }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 
                    className="font-bold text-lg bg-clip-text text-transparent"
                    style={{ backgroundImage: getGradient() }}
                  >
                    Wellness Hub
                  </h2>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Your personal companion</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-3">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {navigationItems.map((item) => {
                      const isActive = location.pathname === item.url;
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            className={`relative overflow-hidden transition-all duration-300 rounded-xl ${
                              isActive 
                                ? `text-white shadow-lg` 
                                : isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
                            }`}
                            style={isActive ? { background: getGradient() } : {}}
                          >
                            <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : isDark ? 'text-slate-300' : 'text-gray-600'}`} />
                              <span className={`font-medium ${isActive ? 'text-white' : isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                                {item.title}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-100'} p-4`}>
              <Link to={createPageUrl("Profile")}>
                <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: getGradient() }}
                  >
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>Profile & Settings</p>
                    <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Customize your experience</p>
                  </div>
                </div>
              </Link>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col overflow-hidden relative z-10">
            <header className={`${isDark ? 'bg-slate-800/60' : 'bg-white/60'} backdrop-blur-xl border-b ${isDark ? 'border-slate-700' : 'border-gray-100'} px-6 py-4 md:hidden sticky top-0 z-10`}>
              <div className="flex items-center gap-4">
                <SidebarTrigger className={`${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} p-2 rounded-lg transition-colors`} />
                <h1 
                  className="text-lg font-bold bg-clip-text text-transparent"
                  style={{ backgroundImage: getGradient() }}
                >
                  Wellness Hub
                </h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}