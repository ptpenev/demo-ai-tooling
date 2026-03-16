import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { FileText, Download, Filter, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ReportsPage = () => {
  const [filters, setFilters] = useState({
    user_id: '',
    project_id: '',
    date_start: '',
    date_end: '',
    type: ''
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => Promise.resolve([
      { id: 1, name: 'Project Alpha' },
      { id: 2, name: 'Project Beta' }
    ])
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => Promise.resolve([
      { id: 1, first_name: 'John', last_name: 'Doe' },
      { id: 2, first_name: 'Jane', last_name: 'Smith' }
    ])
  });

  const exportMutation = useMutation({
    mutationFn: (format: 'csv' | 'pdf') => {
      // Mock API call
      return new Promise((resolve) => setTimeout(resolve, 1500));
    },
    onSuccess: (_, format) => {
      toast({
        title: "Export Started",
        description: `Your ${format.toUpperCase()} report is being generated in the background.`
      });
    }
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Reporting & Exports
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Employee</label>
              <Select onValueChange={(v) => setFilters({...filters, user_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {users?.map(u => (
                    <SelectItem key={u.id} value={u.id.toString()}>{u.first_name} {u.last_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Select onValueChange={(v) => setFilters({...filters, project_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects?.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Type</label>
              <Select onValueChange={(v) => setFilters({...filters, type: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="WORKING">Working Time</SelectItem>
                  <SelectItem value="OVERTIME">Overtime</SelectItem>
                  <SelectItem value="HOLIDAY">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input type="date" onChange={(e) => setFilters({...filters, date_start: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input type="date" onChange={(e) => setFilters({...filters, date_end: e.target.value})} />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => exportMutation.mutate('csv')}
              disabled={exportMutation.isPending}
            >
              {exportMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Export CSV
            </Button>
            <Button 
              onClick={() => exportMutation.mutate('pdf')}
              disabled={exportMutation.isPending}
            >
              {exportMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Your generated reports will appear here for download.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
