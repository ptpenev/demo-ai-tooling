import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

// Note: In a real environment, we would use @fullcalendar/react.
// Since we cannot run npm install, this is a placeholder/mock of the UI structure.

const UnifiedCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const { data: events, isLoading } = useQuery({
    queryKey: ['calendar-events', format(currentMonth, 'yyyy-MM')],
    queryFn: async () => {
      // Mock API call
      return [
        { id: 'ts-1', title: '8h: Project Alpha', start: '2026-03-16', color: '#3b82f6' },
        { id: 'leave-1', title: 'Leave: Paid Annual', start: '2026-03-20', end: '2026-03-23', color: '#10b981' },
        { id: 'holiday-1', title: 'Holiday: Easter', start: '2026-04-05', color: '#f43f5e' },
      ];
    }
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-8 w-8" />
          Company Calendar
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-secondary rounded-md p-1">
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-4 font-semibold min-w-[150px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex bg-secondary rounded-md p-1">
            <Button 
              variant={view === 'month' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('month')}
            >
              Month
            </Button>
            <Button 
              variant={view === 'week' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button 
              variant={view === 'day' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('day')}
            >
              Day
            </Button>
          </div>
        </div>
      </div>

      <Card className="min-h-[600px]">
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b bg-muted/50">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grid Placeholder */}
          <div className="grid grid-cols-7 auto-rows-[120px]">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="border-r border-b p-2 hover:bg-accent/50 transition-colors">
                <span className="text-sm font-medium text-muted-foreground">{(i % 31) + 1}</span>
                
                {/* Event Placeholder for demonstration */}
                {i === 15 && events?.[0] && (
                  <div 
                    className="mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white truncate"
                    style={{ backgroundColor: events[0].color }}
                  >
                    {events[0].title}
                  </div>
                )}
                {i === 19 && events?.[1] && (
                  <div 
                    className="mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white truncate"
                    style={{ backgroundColor: events[1].color }}
                  >
                    {events[1].title}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs font-medium">Timesheets</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium">Approved Leaves</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-xs font-medium">Company Holidays</span>
        </div>
      </div>
    </div>
  );
};

export default UnifiedCalendar;
