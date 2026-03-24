import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/store/auth';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const profileSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, permissions, fetchProfile } = useAuthStore();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return apiClient.patch('/users/me', data); // Assume WP02 or WP01 has this update logic or will have
    },
    onSuccess: () => {
      fetchProfile();
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    mutation.mutate(data);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <FormLabel className="text-gray-500 text-sm">Email Address (Read Only)</FormLabel>
                  <Input value={user.email} disabled className="mt-1 bg-gray-50" />
                </div>

                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Access & Permissions</CardTitle>
            <CardDescription>Your current system access rights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Active Roles</h4>
                {/* Note: The API returns permissions directly, for actual roles another endpoint or inclusion is needed. Assuming permissions mapped directly. */}
                <div className="flex flex-wrap gap-2">
                  <Badge>Employee</Badge>
                  {permissions.some(p => p.scope === 'all') && <Badge variant="default">Global Admin</Badge>}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Granular Permissions</h4>
                <div className="h-48 overflow-y-auto border rounded-md p-3 space-y-2 bg-gray-50">
                  {permissions.map((p, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-semibold text-blue-600">{p.action}</span> : 
                      <span className="text-gray-700 ml-1">{p.resource}</span> 
                      <Badge variant="outline" className="ml-2 text-xs">{p.scope}</Badge>
                    </div>
                  ))}
                  {permissions.length === 0 && <p className="text-sm text-gray-500">No special permissions.</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
