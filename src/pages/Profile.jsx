import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, UserCircle, Palette, Type, Image as ImageIcon, Sparkles, Moon, Sun, Monitor } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fontFamilies = {
  system: { name: "System Default", style: "font-sans" },
  inter: { name: "Inter (Modern)", style: "font-sans" },
  poppins: { name: "Poppins (Friendly)", style: "font-sans" },
  roboto: { name: "Roboto (Clean)", style: "font-sans" },
  lora: { name: "Lora (Elegant)", style: "font-serif" },
  playfair: { name: "Playfair (Classic)", style: "font-serif" },
  comic_sans: { name: "Comic Sans (Fun)", style: "font-sans" }
};

const presetThemes = [
  { name: "Indigo Dream", primary: "#6366f1", secondary: "#a855f7" },
  { name: "Ocean Blue", primary: "#0ea5e9", secondary: "#06b6d4" },
  { name: "Forest Green", primary: "#10b981", secondary: "#059669" },
  { name: "Sunset Orange", primary: "#f97316", secondary: "#fb923c" },
  { name: "Rose Pink", primary: "#ec4899", secondary: "#f472b6" },
  { name: "Royal Purple", primary: "#9333ea", secondary: "#a855f7" },
  { name: "Crimson Red", primary: "#dc2626", secondary: "#ef4444" },
  { name: "Golden Yellow", primary: "#eab308", secondary: "#facc15" }
];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({
    theme_mode: "light",
    primary_color: "#6366f1",
    secondary_color: "#a855f7",
    font_family: "system",
    background_image: "",
    background_opacity: 0.1,
    sidebar_style: "gradient",
    card_style: "elevated",
    animation_level: "full",
    notifications_enabled: true,
    weekly_goal_reminder: true
  });
  const [previewBg, setPreviewBg] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userData = await User.me();
    setUser(userData);
    
    const userPrefs = {
      theme_mode: userData.theme_mode || "light",
      primary_color: userData.primary_color || "#6366f1",
      secondary_color: userData.secondary_color || "#a855f7",
      font_family: userData.font_family || "system",
      background_image: userData.background_image || "",
      background_opacity: userData.background_opacity ?? 0.1,
      sidebar_style: userData.sidebar_style || "gradient",
      card_style: userData.card_style || "elevated",
      animation_level: userData.animation_level || "full",
      notifications_enabled: userData.notifications_enabled !== false,
      weekly_goal_reminder: userData.weekly_goal_reminder !== false
    };
    
    setPreferences(userPrefs);
    setPreviewBg(userPrefs.background_image);
  };

  const savePreferences = async () => {
    await User.updateMyUserData(preferences);
    window.location.reload(); // Reload to apply theme changes
  };

  const applyPresetTheme = (theme) => {
    setPreferences({
      ...preferences,
      primary_color: theme.primary,
      secondary_color: theme.secondary
    });
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Profile & Customization
          </h1>
          <p className="text-gray-600">Make this app truly yours! ✨</p>
        </div>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  Theme Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", icon: Sun, label: "Light" },
                    { value: "dark", icon: Moon, label: "Dark" },
                    { value: "auto", icon: Monitor, label: "Auto" }
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => setPreferences({ ...preferences, theme_mode: mode.value })}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        preferences.theme_mode === mode.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <mode.icon className="w-6 h-6" />
                      <span className="font-medium">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">Quick Presets</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {presetThemes.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => applyPresetTheme(theme)}
                        className="p-3 rounded-xl border hover:shadow-md transition-all text-left"
                      >
                        <div className="flex gap-2 mb-2">
                          <div 
                            className="w-6 h-6 rounded-full" 
                            style={{ background: theme.primary }}
                          />
                          <div 
                            className="w-6 h-6 rounded-full" 
                            style={{ background: theme.secondary }}
                          />
                        </div>
                        <p className="text-xs font-medium">{theme.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex gap-3 items-center mt-2">
                      <Input
                        type="color"
                        value={preferences.primary_color}
                        onChange={(e) => setPreferences({ ...preferences, primary_color: e.target.value })}
                        className="w-20 h-12 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={preferences.primary_color}
                        onChange={(e) => setPreferences({ ...preferences, primary_color: e.target.value })}
                        placeholder="#6366f1"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Secondary Color</Label>
                    <div className="flex gap-3 items-center mt-2">
                      <Input
                        type="color"
                        value={preferences.secondary_color}
                        onChange={(e) => setPreferences({ ...preferences, secondary_color: e.target.value })}
                        className="w-20 h-12 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={preferences.secondary_color}
                        onChange={(e) => setPreferences({ ...preferences, secondary_color: e.target.value })}
                        placeholder="#a855f7"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div 
                  className="p-6 rounded-xl text-white text-center font-semibold"
                  style={{ 
                    background: `linear-gradient(135deg, ${preferences.primary_color}, ${preferences.secondary_color})` 
                  }}
                >
                  Preview: Your Custom Theme! 🎨
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label>Font Family</Label>
                <Select
                  value={preferences.font_family}
                  onValueChange={(value) => setPreferences({ ...preferences, font_family: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(fontFamilies).map(([key, font]) => (
                      <SelectItem key={key} value={key}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-4 p-4 border rounded-lg">
                  <p className={`text-lg ${fontFamilies[preferences.font_family].style}`}>
                    The quick brown fox jumps over the lazy dog.
                  </p>
                  <p className={`text-sm text-gray-600 mt-2 ${fontFamilies[preferences.font_family].style}`}>
                    Preview of {fontFamilies[preferences.font_family].name}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Background Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Image URL (optional)</Label>
                  <Input
                    value={preferences.background_image}
                    onChange={(e) => {
                      setPreferences({ ...preferences, background_image: e.target.value });
                      setPreviewBg(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pro tip: Use high-quality images from Unsplash or similar
                  </p>
                </div>

                {previewBg && (
                  <>
                    <div>
                      <Label>Background Opacity: {Math.round(preferences.background_opacity * 100)}%</Label>
                      <Slider
                        value={[preferences.background_opacity]}
                        onValueChange={(value) => setPreferences({ ...preferences, background_opacity: value[0] })}
                        min={0}
                        max={1}
                        step={0.05}
                        className="mt-2"
                      />
                    </div>

                    <div className="relative h-40 rounded-xl overflow-hidden border">
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ 
                          backgroundImage: `url(${previewBg})`,
                          opacity: preferences.background_opacity 
                        }}
                      />
                      <div className="relative z-10 flex items-center justify-center h-full">
                        <p className="text-gray-900 font-semibold bg-white/80 px-4 py-2 rounded-lg">
                          Background Preview
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Visual Style
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Sidebar Style</Label>
                  <Select
                    value={preferences.sidebar_style}
                    onValueChange={(value) => setPreferences({ ...preferences, sidebar_style: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gradient">Gradient (Colorful)</SelectItem>
                      <SelectItem value="solid">Solid (Simple)</SelectItem>
                      <SelectItem value="glass">Glass (Modern)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Card Style</Label>
                  <Select
                    value={preferences.card_style}
                    onValueChange={(value) => setPreferences({ ...preferences, card_style: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elevated">Elevated (3D Shadows)</SelectItem>
                      <SelectItem value="flat">Flat (Minimal)</SelectItem>
                      <SelectItem value="outlined">Outlined (Clean)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Animation Level</Label>
                  <Select
                    value={preferences.animation_level}
                    onValueChange={(value) => setPreferences({ ...preferences, animation_level: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full (Smooth & Fluid)</SelectItem>
                      <SelectItem value="reduced">Reduced (Subtle)</SelectItem>
                      <SelectItem value="none">None (Performance)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={user.full_name || ""} disabled className="bg-gray-50 mt-2" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user.email || ""} disabled className="bg-gray-50 mt-2" />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input value={user.role || ""} disabled className="bg-gray-50 mt-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  App Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Enable Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates about your progress</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.notifications_enabled}
                    onChange={(e) => setPreferences({ ...preferences, notifications_enabled: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Weekly Goal Reminders</p>
                    <p className="text-sm text-gray-500">Get reminded to check your weekly goals</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.weekly_goal_reminder}
                    onChange={(e) => setPreferences({ ...preferences, weekly_goal_reminder: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 sticky bottom-4">
          <Button
            onClick={savePreferences}
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg"
          >
            Save All Changes ✨
          </Button>
        </div>
      </div>
    </div>
  );
}