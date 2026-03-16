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
import { Check, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const LeaveManagerReviewPage = () => {
  const queryClient = useQueryClient();

  const { data: pendingRequests, isLoading } = useQuery({
    queryKey: ['leaves', 'pending'],
    queryFn: () => Promise.resolve([
      { id: 3, user: { first_name: 'Alice', last_name: 'Wonder' }, type: { name: 'Paid Annual Leave' }, start_date: '2026-05-01', end_date: '2026-05-05', total_days: 3, status: 'PENDING' },
      { id: 4, user: { first_name: 'Bob', last_name: 'Builder' }, type: { name: 'Unpaid Leave' }, start_date: '2026-04-20', end_date: '2026-04-22', total_days: 3, status: 'PENDING' }
    ])
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves', 'pending'] });
      toast({ title: "Request Approved", description: "The leave request has been approved." });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves', 'pending'] });
      toast({ title: "Request Rejected", description: "The leave request has been rejected." });
    }
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leave Approvals</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No pending leave requests.
                  </TableCell>
                </TableRow>
              ) : (
                pendingRequests?.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.user.first_name} {request.user.last_name}
                    </TableCell>
                    <TableCell>{request.type.name}</TableCell>
                    <TableCell>{request.start_date} to {request.end_date}</TableCell>
                    <TableCell>{request.total_days}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => approveMutation.mutate(request.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => rejectMutation.mutate(request.id)}
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

export default LeaveManagerReviewPage;
