import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/store/auth';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  target_type: z.enum(['all', 'user', 'team', 'project']),
  target_id: z.string().optional(),
});

const pollSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  is_anonymous: z.boolean(),
  allow_multiple: z.boolean(),
  options: z.string().min(1, 'Options (comma separated) required'),
});

type PollFormData = z.infer<typeof pollSchema>;

export default function Home() {
  const queryClient = useQueryClient();
  const { permissions } = useAuthStore();
  const [isAnnDialog, setIsAnnDialog] = useState(false);
  const [isPollDialog, setIsPollDialog] = useState(false);

  const canCreateAnnouncement = permissions.some((p) => p.action === 'create' && p.resource === 'announcement');
  const canCreatePoll = permissions.some((p) => p.action === 'create' && p.resource === 'poll');

  const { data: announcementsData, isLoading: isLoadingAnns } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await apiClient.get('/announcements');
      return res.data.data;
    },
  });

  const { data: pollsData, isLoading: isLoadingPolls } = useQuery({
    queryKey: ['polls'],
    queryFn: async () => {
      const res = await apiClient.get('/polls');
      return res.data.data;
    },
  });

  const annForm = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: '', content: '', target_type: 'all', target_id: '' },
  });

  const pollForm = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
    defaultValues: { question: '', options: '', is_anonymous: false, allow_multiple: false },
  });

  const annMutation = useMutation({
    mutationFn: async (data: z.infer<typeof announcementSchema>) => {
      return apiClient.post('/announcements', {
        title: data.title,
        content: data.content,
        targets: [{ target_type: data.target_type, target_id: data.target_id || undefined }]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setIsAnnDialog(false);
      annForm.reset();
    }
  });

  const pollMutation = useMutation({
    mutationFn: async (data: z.infer<typeof pollSchema>) => {
      const optionsArr = data.options.split(',').map(o => o.trim()).filter(Boolean);
      return apiClient.post('/polls', {
        question: data.question,
        options: optionsArr,
        is_anonymous: data.is_anonymous,
        allow_multiple: data.allow_multiple,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
      setIsPollDialog(false);
      pollForm.reset();
    }
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ANNOUNCEMENTS SECTION */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Announcements</h2>
            {canCreateAnnouncement && (
              <Dialog open={isAnnDialog} onOpenChange={setIsAnnDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">Create</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Announcement</DialogTitle>
                  </DialogHeader>
                  <Form {...annForm}>
                    <form onSubmit={annForm.handleSubmit((d) => annMutation.mutate(d))} className="space-y-4">
                      <FormField
                        control={annForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={annForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={annForm.control}
                        name="target_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="team">Team</SelectItem>
                                <SelectItem value="project">Project</SelectItem>
                                <SelectItem value="user">Specific User</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      {annForm.watch('target_type') !== 'all' && (
                        <FormField
                          control={annForm.control}
                          name="target_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target ID</FormLabel>
                              <FormControl><Input placeholder="UUID of project/team/user" {...field} /></FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                      <Button type="submit" disabled={annMutation.isPending} className="w-full">
                        {annMutation.isPending ? 'Saving...' : 'Publish'}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <div className="space-y-4">
            {isLoadingAnns ? <p>Loading announcements...</p> : 
             announcementsData?.length === 0 ? <p className="text-gray-500 text-sm">No new announcements.</p> :
             announcementsData?.map((ann: any) => (
              <Card key={ann.id} className={ann.title.includes('Birthday') ? 'border-yellow-300 bg-yellow-50' : ''}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{ann.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{ann.content}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className="text-xs text-gray-400">
                    Posted on {new Date(ann.created_at).toLocaleDateString()}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* POLLS SECTION */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Polls</h2>
            {canCreatePoll && (
              <Dialog open={isPollDialog} onOpenChange={setIsPollDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">Create Poll</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Poll</DialogTitle>
                  </DialogHeader>
                  <Form {...pollForm}>
                    <form onSubmit={pollForm.handleSubmit((d) => pollMutation.mutate(d))} className="space-y-4">
                      <FormField
                        control={pollForm.control}
                        name="question"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={pollForm.control}
                        name="options"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Options (comma separated)</FormLabel>
                            <FormControl><Input placeholder="Option 1, Option 2" {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={pollForm.control}
                        name="allow_multiple"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                            <FormLabel className="!mt-0">Allow Multiple Choice</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={pollForm.control}
                        name="is_anonymous"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                            <FormLabel className="!mt-0">Anonymous Voting</FormLabel>
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={pollMutation.isPending} className="w-full">
                        {pollMutation.isPending ? 'Saving...' : 'Create Poll'}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <div className="space-y-4">
            {isLoadingPolls ? <p>Loading polls...</p> : 
             pollsData?.length === 0 ? <p className="text-gray-500 text-sm">No active polls.</p> :
             pollsData?.map((poll: any) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function PollCard({ poll }: { poll: any }) {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const voteMutation = useMutation({
    mutationFn: async (optionIds: string[]) => {
      return apiClient.post(`/polls/${poll.id}/vote`, { option_ids: optionIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error voting');
    }
  });

  const handleVote = () => {
    if (selectedIds.length > 0) {
      voteMutation.mutate(selectedIds);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md">{poll.question}</CardTitle>
        <p className="text-xs text-gray-400">
          {poll.is_anonymous ? 'Anonymous' : 'Public'} • {poll.allow_multiple ? 'Multiple Choice' : 'Single Choice'}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {poll.allow_multiple ? (
          <div className="space-y-2">
            {poll.options?.map((opt: any) => (
              <div key={opt.id} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={selectedIds.includes(opt.id)}
                    onCheckedChange={(checked) => {
                      if (checked) setSelectedIds([...selectedIds, opt.id]);
                      else setSelectedIds(selectedIds.filter(id => id !== opt.id));
                    }}
                  />
                  <label className="text-sm">{opt.option_text}</label>
                </div>
                <Progress value={0} className="h-1 bg-gray-100" />
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup onValueChange={(val) => setSelectedIds([val])} value={selectedIds[0]}>
            <div className="space-y-2">
              {poll.options?.map((opt: any) => (
                <div key={opt.id} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.id} id={opt.id} />
                    <label htmlFor={opt.id} className="text-sm">{opt.option_text}</label>
                  </div>
                  <Progress value={0} className="h-1 bg-gray-100" />
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full" onClick={handleVote} disabled={selectedIds.length === 0 || voteMutation.isPending}>
          {voteMutation.isPending ? 'Voting...' : 'Vote'}
        </Button>
      </CardFooter>
    </Card>
  );
}
