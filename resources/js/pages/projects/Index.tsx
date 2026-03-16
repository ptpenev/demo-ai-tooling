import React, { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Internal Operations Platform',
      description: 'Unified tool for timesheets and leave management',
      is_active: true,
      manager: 'John Doe',
      team_lead: 'Jane Smith',
      members_count: 12
    },
    {
      id: 2,
      name: 'Legacy Migration',
      description: 'Decommissioning old tools',
      is_active: false,
      manager: 'Alice Brown',
      team_lead: 'Bob Wilson',
      members_count: 5
    }
  ]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
               {/* Form placeholder */}
               <p>Project details form would go here</p>
            </div>
            <Button className="w-full">Save Project</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Team Lead</TableHead>
            <TableHead>Members</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <div className="font-medium">{project.name}</div>
                <div className="text-xs text-muted-foreground">{project.description}</div>
              </TableCell>
              <TableCell>
                <Badge variant={project.is_active ? 'default' : 'secondary'}>
                  {project.is_active ? 'Active' : 'Archived'}
                </Badge>
              </TableCell>
              <TableCell>{project.manager}</TableCell>
              <TableCell>{project.team_lead}</TableCell>
              <TableCell>{project.members_count}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Team</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsPage;
