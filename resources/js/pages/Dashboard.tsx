import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnnouncementFeed from '@/pages/announcements/AnnouncementFeed';
import UnifiedCalendar from '@/components/Calendar/UnifiedCalendar';
import { Clock, CalendarCheck, Megaphone, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Hours This Week', value: '32h', icon: Clock, color: 'text-blue-500' },
    { title: 'Remaining Leave', value: '15.5d', icon: CalendarCheck, color: 'text-emerald-500' },
    { title: 'Active Polls', value: '2', icon: BarChart3, color: 'text-purple-500' },
    { title: 'New Announcements', value: '1', icon: Megaphone, color: 'text-rose-500' },
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-extrabold tracking-tight">Welcome back, John</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-0">
              <UnifiedCalendar />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <AnnouncementFeed />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
