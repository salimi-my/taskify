'use client';

import * as z from 'zod';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { type User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Suspense, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { CreateTaskSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MultipleSelector } from '@/components/ui/multiple-selector';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';

const Editor = dynamic(() => import('@/components/mdx-editor/editor'), {
  ssr: false
});

interface CreateTaskFormProps {
  users: User[] | null;
}

export function CreateTaskForm({ users }: CreateTaskFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateTaskSchema>>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: '',
      body: '',
      projectId: '',
      label: undefined,
      priority: undefined,
      assignees: []
    }
  });

  const onSubmit = (values: z.infer<typeof CreateTaskSchema>) => {
    startTransition(() => {
      // TODO: Add create task server action
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col xl:grid xl:grid-cols-10 gap-4'>
          <div className='xl:col-span-7'>
            <Card className='rounded-lg border-none'>
              <CardHeader className='mx-[1px] pb-9'>
                <CardTitle className='text-xl font-semibold'>
                  Create Task
                </CardTitle>
                <CardDescription>
                  Fill in the form to create a new task.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Enter title'
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='body'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Suspense fallback={null}>
                          <Editor
                            markdown={form.watch('body')}
                            setMarkdown={field.onChange}
                          />
                        </Suspense>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-end gap-2 mt-2'>
                  <Button
                    disabled={isPending}
                    type='submit'
                    variant='default'
                    className='min-w-24'
                  >
                    {isPending && (
                      <>
                        <Loader2 className='animate-spin mr-2' size={18} />
                        Saving...
                      </>
                    )}
                    {!isPending && <>Save</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='xl:col-span-3'>
            <Card className='rounded-lg border-none'>
              <CardHeader className='mx-[1px] pb-9'>
                <CardTitle className='text-xl font-semibold'>
                  Task Details
                </CardTitle>
                <CardDescription>
                  Manage additional task details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='assignees'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignees</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          {...field}
                          defaultOptions={
                            users && users.length > 0
                              ? users.map((user) => ({
                                  id: user.id,
                                  value: user.name || '',
                                  label: user.name || ''
                                }))
                              : []
                          }
                          placeholder='Select assignees'
                          emptyIndicator={
                            <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                              No results found.
                            </p>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
