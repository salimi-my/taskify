'use client';

import * as z from 'zod';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Suspense, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TaskLabel,
  TaskPriority,
  type Project,
  type User
} from '@prisma/client';

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
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent
} from '@/components/ui/select';

const Editor = dynamic(() => import('@/components/mdx-editor/editor'), {
  ssr: false
});

interface CreateTaskFormProps {
  users: User[] | null;
  projects: Project[] | null;
}

export function CreateTaskForm({ users, projects }: CreateTaskFormProps) {
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
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='label'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select label' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={TaskLabel.BUG}>Bug</SelectItem>
                          <SelectItem value={TaskLabel.FEATURE}>
                            Feature
                          </SelectItem>
                          <SelectItem value={TaskLabel.ENHANCEMENT}>
                            Enhancement
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='priority'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select priority' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                          <SelectItem value={TaskPriority.MEDIUM}>
                            Medium
                          </SelectItem>
                          <SelectItem value={TaskPriority.HIGH}>
                            High
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='projectId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select project' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects ? (
                            projects.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value='none' disabled>
                              No projects found.
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          placeholder='Assign users to this task'
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
