import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Clock, Lock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

// Mocking Echo for the demonstration
const usePollEcho = (pollId: number, onUpdate: (data: any) => void) => {
  useEffect(() => {
    console.log(`Subscribing to poll.${pollId}`);
    // window.Echo.channel('polls').listen('PollUpdated', (e) => {
    //   if (e.poll.id === pollId) onUpdate(e.poll);
    // });
    return () => console.log(`Unsubscribing from poll.${pollId}`);
  }, [pollId]);
};

const PollCard = ({ poll }: { poll: any }) => {
  const queryClient = useQueryClient();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  usePollEcho(poll.id, (updatedPoll) => {
    queryClient.setQueryData(['polls'], (old: any[]) => 
      old.map(p => p.id === updatedPoll.id ? updatedPoll : p)
    );
  });

  const voteMutation = useMutation({
    mutationFn: (optionId: number) => {
      // API call: POST /api/polls/{id}/vote
      return Promise.resolve();
    },
    onSuccess: () => {
      toast({ title: "Vote Cast", description: "Your vote has been recorded." });
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    }
  });

  const totalVotes = poll.votes?.length || 0;
  const hasVoted = false; // logic to check if user ID is in poll.votes

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{poll.question}</CardTitle>
          <Badge variant={poll.is_anonymous ? "secondary" : "outline"}>
            {poll.is_anonymous ? <Lock className="h-3 w-3 mr-1" /> : null}
            {poll.is_anonymous ? "Anonymous" : "Public"}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Ends: {poll.deadline ? format(new Date(poll.deadline), 'MMM d, h:mm a') : 'No deadline'}
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            {totalVotes} total votes
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {poll.options.map((option: any) => {
          const optionVotes = poll.votes?.filter((v: any) => v.poll_option_id === option.id).length || 0;
          const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;

          return (
            <div key={option.id} className="space-y-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{option.text}</span>
                <span className="text-muted-foreground">{Math.round(percentage)}% ({optionVotes})</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={percentage} className="h-2" />
                {!hasVoted && (
                  <Button 
                    size="sm" 
                    variant={selectedOption === option.id ? "default" : "outline"}
                    className="h-8 w-20"
                    onClick={() => setSelectedOption(option.id)}
                  >
                    Select
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {!hasVoted && (
          <Button 
            className="w-full mt-4" 
            disabled={!selectedOption || voteMutation.isPending}
            onClick={() => selectedOption && voteMutation.mutate(selectedOption)}
          >
            {voteMutation.isPending ? "Casting Vote..." : "Cast Vote"}
          </Button>
        )}

        {hasVoted && (
          <div className="flex items-center justify-center gap-2 text-green-600 font-medium py-2">
            <CheckCircle2 className="h-5 w-5" />
            You have already voted
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PollsPage = () => {
  const { data: polls, isLoading } = useQuery({
    queryKey: ['polls'],
    queryFn: () => Promise.resolve([
      { 
        id: 1, 
        question: 'Which pizza should we order for the Friday hackathon?', 
        is_anonymous: false, 
        deadline: '2026-03-20T17:00:00Z',
        options: [
          { id: 1, text: 'Margherita' },
          { id: 2, text: 'Pepperoni' },
          { id: 3, text: 'Veggie Supreme' }
        ],
        votes: [
          { poll_option_id: 1 }, { poll_option_id: 2 }, { poll_option_id: 2 }
        ]
      }
    ])
  });

  if (isLoading) return <div className="p-8 text-center">Loading polls...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Interactive Polls</h1>
        <Button>Create Poll</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {polls?.map(poll => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </div>
  );
};

export default PollsPage;
