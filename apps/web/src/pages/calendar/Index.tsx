import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/store/auth';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function CalendarPage() {
  const { permissions } = useAuthStore();
  const [scope, setScope] = useState<string>('own');
  const [projectId, setProjectId] = useState<string>('');

  // Fetch projects to populate the filter dropdown (if they have team/project scope permissions)
  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get('/projects');
      return res.data.data;
    },
  });

  const canViewOthers = permissions.some(
    p => p.resource === 'calendar' && ['team', 'project', 'all'].includes(p.scope)
  );

  // Just fetch a wide range for demo purposes (e.g., current year)
  // In a real app, we'd use FullCalendar's datesSet callback to fetch dynamic ranges.
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['calendar', scope, projectId, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('start_date', startDate);
      params.append('end_date', endDate);
      
      if (scope !== 'own') {
        params.append('scope', scope);
      } else {
        params.append('scope', 'own');
      }

      if (projectId && projectId !== 'all') {
        params.append('project_id', projectId);
      }

      const res = await apiClient.get(`/calendar?${params.toString()}`);
      return res.data.data;
    },
  });

  const formattedEvents = useMemo(() => {
    if (!eventsData) return [];

    return eventsData.map((ev: any) => {
      if (ev.type === 'holiday') {
        return {
          title: `🌴 ${ev.name}`,
          start: ev.date,
          allDay: true,
          backgroundColor: '#ef4444', // red-500
          borderColor: '#ef4444',
        };
      }
      
      if (ev.type === 'leave') {
        const isApproved = ev.status === 'approved';
        return {
          title: `🏖️ ${ev.leave_type} (${ev.status}) - ${ev.user_id?.substring(0,6)}`,
          start: ev.date,
          allDay: true,
          backgroundColor: isApproved ? '#22c55e' : '#f97316', // green-500 or orange-500
          borderColor: isApproved ? '#22c55e' : '#f97316',
        };
      }

      if (ev.type === 'timesheet') {
        return {
          title: `⏱️ ${ev.hours}h - ${ev.project} - ${ev.user_id?.substring(0,6)}`,
          start: ev.date,
          allDay: true,
          backgroundColor: '#3b82f6', // blue-500
          borderColor: '#3b82f6',
        };
      }

      return null;
    }).filter(Boolean);
  }, [eventsData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Unified Calendar</h1>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end bg-gray-50">
          <div className="flex-1 space-y-2">
            <Label>View Scope</Label>
            <Select value={scope} onValueChange={setScope} disabled={!canViewOthers}>
              <SelectTrigger>
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="own">My Calendar</SelectItem>
                {canViewOthers && (
                  <>
                    <SelectItem value="team">My Team</SelectItem>
                    <SelectItem value="project">Specific Project</SelectItem>
                    <SelectItem value="all">All (Global)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {(scope === 'project' || scope === 'team') && (
            <div className="flex-1 space-y-2">
              <Label>Project Filter</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Available</SelectItem>
                  {projectsData?.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button variant="outline" onClick={() => { setScope('own'); setProjectId(''); }}>
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="bg-white p-4 rounded-xl border shadow-sm min-h-[600px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">Loading calendar data...</div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={formattedEvents}
            height="700px"
          />
        )}
      </div>

      <div className="flex gap-4 text-sm text-gray-600 justify-center">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Timesheets</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Approved Leave</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Pending Leave</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Holidays</div>
      </div>
    </div>
  );
}
