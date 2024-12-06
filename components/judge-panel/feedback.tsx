/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from '@/utils/axios';
import { FC, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { CommentRatings } from '../ratings';
import { AutosizeTextarea } from '../autosize-textarea';
import { useEvaluationParameter, useJudgeUser } from '@/hooks/use-judge';
import { ScrollArea } from '../ui/scroll-area';

const FeedbackSchema = z.object({
  parameter_scores: z.array(
    z.object({
      parameter_uuid: z.string(),
      notes: z.string().optional(),
      score: z.number().min(0).max(5),
    })
  ),
});

interface FeedbackJudgeProps {
  competitionUuid: string;
  submissionUuid: string;
}

const FeedbackJudge: FC<FeedbackJudgeProps> = ({
  competitionUuid,
  submissionUuid,
}) => {
  const { parameters, isLoading } = useEvaluationParameter(competitionUuid);
  const form = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      parameter_scores: [],
    },
  });
  const [loading, setLoading] = useState(false);
  const { judge } = useJudgeUser();
  const router = useRouter();

  useEffect(() => {
    if (parameters) {
      form.reset({
        parameter_scores: parameters.map((param: any) => ({
          parameter_uuid: param.uuid,
          notes: '',
          score: 0,
        })),
      });
    }
  }, [parameters, form]);

  async function onSubmit(data: z.infer<typeof FeedbackSchema>) {
    setLoading(true);

    try {
      const { data: judgeData } = await axios.patch(
        `/judges/${judge && judge.uuid}/submission`,
        {
          submission_uuid: submissionUuid,
          parameter_scores: data.parameter_scores,
        }
      );
      router.push('/judge/dashboard');
      toast({
        title: 'Success!',
        description: judgeData.message,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast({
          title: 'Error!',
          description:
            error?.response.data.message ||
            error?.response.data.error ||
            'An error occurred while add the blog.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) return <h1>loading</h1>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='items-end'>Judge Submission</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Judge Submission</DialogTitle>
          <DialogDescription>
            {`Judge submission. Click judge when you're done.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className='h-[500px]'>
              {parameters?.map((param: any, index: number) => (
                <FormField
                  key={param.uuid}
                  control={form.control}
                  name={`parameter_scores.${index}.score`}
                  render={({ field }) => (
                    <FormItem className='p-4'>
                      <FormLabel>{param.parameterName}</FormLabel>
                      <FormControl>
                        <CommentRatings
                          rating={field.value}
                          totalStars={5}
                          size={32}
                          variant='yellow'
                          onRatingChange={(value) =>
                            form.setValue(
                              `parameter_scores.${index}.score`,
                              value
                            )
                          }
                        />
                      </FormControl>
                      <FormField
                        name={`parameter_scores.${index}.notes`}
                        render={({ field }) => (
                          <AutosizeTextarea
                            placeholder={`Notes for ${param.parameterName}`}
                            {...field}
                          />
                        )}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </ScrollArea>
            <DialogFooter>
              <Button className='mt-6' disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className='animate-spin' /> {`Judging...`}
                  </>
                ) : (
                  'Judge'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackJudge;
