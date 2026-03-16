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

const PermissionsPage = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', permissions: ['users.view', 'users.edit'] },
    { id: 2, name: 'Project Manager', permissions: ['projects.view', 'timesheets.approve'] },
  ]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Role & Permission Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Role</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            {/* Form for role creation would go here */}
            <div className="py-4">
              <p>Role creation form placeholder</p>
            </div>
            <Button>Save Role</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role Name</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((p) => (
                    <span
                      key={p}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  Edit Permissions
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PermissionsPage;
