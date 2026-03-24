import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/store/auth';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const timesheetSchema = z.object({
  project_id: z.string().min(1, 'Project is required'),
  date: z.string().min(1, 'Date is required'),
  hours: z.number().min(0.1).max(24),
  time_type: z.string().min(1, 'Time type is required'),
  comment: z.string().optional(),
});

type TimesheetFormData = z.infer<typeof timesheetSchema>;

export default function Timesheets() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  // Filters
  const [projectIdFilter, setProjectIdFilter] = useState<string>('');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');

  const { user } = useAuthStore();

  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get('/projects');
      return res.data.data;
    },
  });

  const { data: timesheetsData, isLoading: isLoadingTimesheets } = useQuery({
    queryKey: ['timesheets', projectIdFilter, startDateFilter, endDateFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (projectIdFilter && projectIdFilter !== 'all') params.append('project_id', projectIdFilter);
      if (startDateFilter) params.append('start_date', startDateFilter);
      if (endDateFilter) params.append('end_date', endDateFilter);
      
      const res = await apiClient.get(`/timesheets?${params.toString()}`);
      return res.data.data;
    },
  });

  const form = useForm<TimesheetFormData>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: {
      project_id: '',
      date: new Date().toISOString().split('T')[0],
      hours: 8,
      time_type: 'working_time',
      comment: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TimesheetFormData) => {
      if (editingEntry) {
        return apiClient.patch(`/timesheets/${editingEntry.id}`, {
          date: data.date,
          hours: data.hours,
          time_type: data.time_type,
          comment: data.comment,
        });
      }
      return apiClient.post('/timesheets', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      setIsDialogOpen(false);
      form.reset();
      setEditingEntry(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/timesheets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    form.reset({
      project_id: entry.project_id, // Cannot update project via API usually, but keep it in form
      date: entry.date,
      hours: parseFloat(entry.hours),
      time_type: entry.time_type,
      comment: entry.comment || '',
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: TimesheetFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Timesheets</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingEntry(null);
            form.reset({
              project_id: '',
              date: new Date().toISOString().split('T')[0],
              hours: 8,
              time_type: 'working_time',
              comment: '',
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button>Log Hours</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingEntry ? 'Edit Timesheet' : 'Log New Hours'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="project_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!editingEntry}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingProjects ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : (
                            projectsData?.map((p: any) => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.5" min="0.1" max="24" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="time_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="working_time">Working Time</SelectItem>
                          <SelectItem value="overtime">Overtime</SelectItem>
                          <SelectItem value="day_off">Day Off</SelectItem>
                          <SelectItem value="client_agreement">Client Agreement</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="What did you work on?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={mutation.isPending} className="w-full">
                  {mutation.isPending ? 'Saving...' : 'Save Entry'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-4 rounded-md border flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium">Filter by Project</label>
          <Select value={projectIdFilter} onValueChange={setProjectIdFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projectsData?.map((p: any) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium">Start Date</label>
          <Input type="date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium">End Date</label>
          <Input type="date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
        </div>
        <Button variant="outline" onClick={() => { setProjectIdFilter('all'); setStartDateFilter(''); setEndDateFilter(''); }}>
          Clear Filters
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingTimesheets ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">Loading...</TableCell>
              </TableRow>
            ) : timesheetsData?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                  No timesheet entries found.
                </TableCell>
              </TableRow>
            ) : (
              timesheetsData?.map((entry: any) => {
                const project = projectsData?.find((p: any) => p.id === entry.project_id);
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.date}</TableCell>
                    <TableCell>{project?.name || 'Unknown Project'}</TableCell>
                    <TableCell>{entry.hours}</TableCell>
                    <TableCell className="capitalize">{entry.time_type.replace('_', ' ')}</TableCell>
                    <TableCell>
                      {entry.is_approved ? (
                        <Badge variant="default" className="bg-green-500">Approved</Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(entry)}
                        disabled={entry.is_approved || entry.user_id !== user?.id}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => deleteMutation.mutate(entry.id)}
                        disabled={entry.is_approved || entry.user_id !== user?.id || deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
