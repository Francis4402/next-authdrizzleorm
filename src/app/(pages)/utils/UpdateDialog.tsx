"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { useForm } from 'react-hook-form'
import { PostFormValues, PostValidation } from '../schema/PostValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Post } from '@/app/types'
import { toast } from 'sonner'
import { updatePost } from '@/app/services/postservices'



const UpdateDialog = ({post, isEditDialogOpen, setIsEditDialogOpen, onUpdateSuccess}: {post: Post, isEditDialogOpen: boolean, setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>, onUpdateSuccess: (id: string) => void}) => {


    const form = useForm<PostFormValues>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            title: post.title || '',
            content: post.content || ''
        }
    });

    const {formState: {isSubmitting}} = form;

    const handleUpdate = async (data: PostFormValues) => {
        try {
            const res = await updatePost({
                id: post.id,
                ...data
            });

            if (res) {
                toast.success("Post updated successfully");
                setIsEditDialogOpen(false);
                onUpdateSuccess(post.id!);
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to update post");
        }
    };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
            <Button variant="outline" onClick={(e) => e.stopPropagation()}>Edit</Button>
        </DialogTrigger>
        <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
                <DialogTitle>Update Post</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                    
                    <FormField
                        control={form.control} 
                        name="title" 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <Input 
                                    type="text" 
                                    {...field} 
                                    placeholder="Title"  
                                />
                                <FormMessage />
                            </FormItem>
                        )} 
                    />
                    <FormField 
                        control={form.control} 
                        name="content" 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <Textarea 
                                    {...field} 
                                    placeholder="Content" 
                                    rows={5}
                                />
                                <FormMessage/>
                            </FormItem>
                        )} 
                    />
                    <DialogFooter>
                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Updating..." : "Update Post"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default UpdateDialog