/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PostFormValues, PostValidation } from '../schema/PostValidation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createPost } from '@/app/services/postservices'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Post } from '@/app/types'

const PostForm = () => {

    const router = useRouter();

    const form = useForm<PostFormValues>({
        resolver: zodResolver(PostValidation)
    });

    const {formState: {isSubmitting}} = form;

    const onSubmit = async (data: Post) => {
      try {
        const res = await createPost(data);

        if (res) {
          toast.success("Post created successfully");
          form.reset();
          router.push("/");
        }
      } catch (error: any) {
        console.error("Submission error:", error);
        toast.error(error.message || "Failed to create post");
      }
    };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Create Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-6'>
                <FormField control={form.control} name="title" render={({field}) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <Input type='text' {...field} value={field.value || ''} placeholder='title'  />
                        <FormMessage/>
                    </FormItem>
                )} />

                <FormField control={form.control} name="content" render={({field}) => (
                    <FormItem>
                        <FormLabel>Content</FormLabel>
                        <Input type='text' {...field} value={field.value || ''} placeholder='content' />
                        <FormMessage/>
                    </FormItem>
                )} />

                <Button type='submit' className='w-full h-10 text-sm font-medium' disabled={isSubmitting}>
                    { isSubmitting ? "Submitting...." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
    </Card>
  )
}

export default PostForm