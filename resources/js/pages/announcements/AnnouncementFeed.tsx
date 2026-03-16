import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

const AnnouncementFeed = () => {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => Promise.resolve([
      { 
        id: 1, 
        title: 'Office Holiday - Easter', 
        content: 'The office will be closed from April 10th to April 13th for the Easter holidays. Enjoy your time off!', 
        valid_from: '2026-03-15T09:00:00Z', 
        creator: { first_name: 'Admin', last_name: 'User' } 
      },
      { 
        id: 2, 
        title: 'New Health Insurance Policy', 
        content: 'We have updated our health insurance provider. Please check the internal docs for more details on the new benefits.', 
        valid_from: '2026-03-10T10:00:00Z', 
        creator: { first_name: 'HR', last_name: 'Manager' } 
      }
    ])
  });

  if (isLoading) return <div className="p-4 text-center">Loading announcements...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold">Latest Announcements</h2>
      </div>

      {announcements?.length === 0 ? (
        <p className="text-muted-foreground italic text-center py-8">No active announcements.</p>
      ) : (
        announcements?.map((ann) => (
          <Card key={ann.id} className="overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold">{ann.title}</CardTitle>
                <Badge variant="outline">New</Badge>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(ann.valid_from), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {ann.creator.first_name} {ann.creator.last_name}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{ann.content}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default AnnouncementFeed;
