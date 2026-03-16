import React from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ManagerReviewPage = () => {
  const queryClient = useQueryClient();

  const { data: pendingEntries, isLoading } = useQuery({
    queryKey: ['timesheets', 'pending'],
    queryFn: () => Promise.resolve([
      { id: 1, user: { first_name: 'John', last_name: 'Doe' }, project: { name: 'Project Alpha' }, date: '2026-03-16', hours: 8, time_type: 'WORKING', comment: 'Developing UI', status: 'PENDING' },
      { id: 2, user: { first_name: 'Jane', last_name: 'Smith' }, project: { name: 'Project Beta' }, date: '2026-03-16', hours: 4, time_type: 'OVERTIME', comment: 'Fixing bugs', status: 'PENDING' }
    ])
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets', 'pending'] });
      toast({ title: "Entry Approved", description: "The timesheet entry has been approved." });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets', 'pending'] });
      toast({ title: "Entry Rejected", description: "The timesheet entry has been rejected." });
    }
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manager Review</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingEntries?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No pending entries found.
                  </TableCell>
                </TableRow>
              ) : (
                pendingEntries?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.user.first_name} {entry.user.last_name}
                    </TableCell>
                    <TableCell>{entry.project.name}</TableCell>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.hours}h</TableCell>
                    <TableCell className="max-w-xs truncate" title={entry.comment}>
                      {entry.comment}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => approveMutation.mutate(entry.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => rejectMutation.mutate(entry.id)}
                      >
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
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

export default ManagerReviewPage;
