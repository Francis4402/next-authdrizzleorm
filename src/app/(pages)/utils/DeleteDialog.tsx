import { deletePost } from '@/app/services/postservices'
import { Post } from '@/app/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const DeleteDialog = ({post, isDeleteDialogOpen, setIsDeleteDialogOpen, onDeleteSuccess}: {post: Post, isDeleteDialogOpen: boolean, setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>, onDeleteSuccess: (id: string) => void}) => {


    const {formState: {isSubmitting}} = useForm();

    const handleDeleteClick = async () => {
        try {
          const res = await deletePost(post.id!);
          if (res?.success) {
            toast.success("Post deleted successfully");
            setIsDeleteDialogOpen(false);
            onDeleteSuccess(post.id!);
          } else {
            toast.error(res?.message || "Error deleting post");
          }
        } catch (error) {
          console.log(error);
          toast.error("Failed to delete post");
        }
      };
    
  return (
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
  )
}

export default DeleteDialog