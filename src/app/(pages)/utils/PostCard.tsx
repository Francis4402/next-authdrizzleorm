"use client"

import { deletePost, updatePost } from "@/app/services/postservices";
import { Post } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PostFormValues, PostValidation } from "../schema/PostValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PostCard = ({post}: {post: Post}) => {
    const router = useRouter();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
                router.refresh();
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to update post");
        }
    };

    const handleCardClick = () => {
        router.push(`/${post.id}`);
    };
    
    const handleDeleteClick = async () => {
        try {
            const res = await deletePost(post.id!);
            if (res?.success) {
                toast.success("Post deleted successfully");
                setIsDeleteDialogOpen(false);
                router.refresh();
            } else {
                toast.error(res?.message || "Error deleting post");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete post");
        }
    };

    return (
        <Card 
            key={post.id} 
            onClick={handleCardClick}
            className="cursor-pointer hover:bg-gray-50 transition-colors"
        >
            <CardHeader>
                <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{post.content}</CardDescription>
            </CardContent>
            <CardFooter className="gap-2">
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
                                            <FormMessage/>
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
                
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive" onClick={(e) => e.stopPropagation()}>Delete</Button>
                    </DialogTrigger>
                    <DialogContent onClick={(e) => e.stopPropagation()}>
                        <DialogHeader>
                            <DialogTitle>Delete Post</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this post?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button 
                                variant="destructive" 
                                onClick={handleDeleteClick}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Deleting..." : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    )
}

export default PostCard;