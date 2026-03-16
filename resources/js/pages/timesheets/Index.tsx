import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const TimesheetPage = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data/hooks - in real implementation these would call the API
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => Promise.resolve([
      { id: 1, name: 'Project Alpha' },
      { id: 2, name: 'Project Beta' }
    ])
  });

  const { data: entries } = useQuery({
    queryKey: ['timesheets', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => Promise.resolve([
      { id: 1, project_id: 1, project: { name: 'Project Alpha' }, date: format(selectedDate, 'yyyy-MM-dd'), hours: 8, time_type: 'WORKING', comment: 'Developing UI' }
    ])
  });

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const totalHours = entries?.reduce((sum, entry) => sum + Number(entry.hours), 0) || 0;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Timesheets</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-secondary rounded-md p-1">
            <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, -7))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-4 font-medium">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </span>
            <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 7))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Log Time
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Working Hours</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(selectedDate, 'PPP')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hours</label>
                    <Input type="number" step="0.5" placeholder="0.0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Type</label>
                  <Select defaultValue="WORKING">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WORKING">Working Time</SelectItem>
                      <SelectItem value="OVERTIME">Overtime</SelectItem>
                      <SelectItem value="HOLIDAY">Holiday</SelectItem>
                      <SelectItem value="CLIENT_EXTRA">Client Extra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Comment</label>
                  <Input placeholder="What did you work on?" />
                </div>
              </div>
              <Button className="w-full" onClick={() => setIsDialogOpen(false)}>Save Entry</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => (
          <Card 
            key={day.toString()} 
            className={cn(
              "cursor-pointer transition-colors hover:bg-accent",
              format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && "border-primary bg-accent"
            )}
            onClick={() => setSelectedDate(day)}
          >
            <CardHeader className="p-3 text-center">
              <p className="text-xs text-muted-foreground uppercase">{format(day, 'eee')}</p>
              <p className="text-lg font-bold">{format(day, 'd')}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">
            Entries for {format(selectedDate, 'eeee, MMMM do')}
          </CardTitle>
          <div className="text-sm font-medium text-muted-foreground">
            Total: {totalHours}h
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No time entries logged for this day.
                  </TableCell>
                </TableRow>
              ) : (
                entries?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.project.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                        {entry.time_type.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>{entry.comment}</TableCell>
                    <TableCell className="text-right">{entry.hours}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimesheetPage;
