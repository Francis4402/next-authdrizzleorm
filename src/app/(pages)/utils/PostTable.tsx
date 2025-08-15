"use client"

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Post } from "@/app/types";
import UpdateDialog from "./UpdateDialog";
import DeleteDialog from "./DeleteDialog";
import { MainTable } from "../Table/Table";



const PostTable = ({posts}: {posts: Post[]}) => {

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [, setLocalPosts] = useState<Post[]>(posts);

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({row}) => <div className="text-left">{row.getValue('title')}</div>
    },
    {
      accessorKey: 'content',
      header: 'Content',
      cell: ({row}) => <div className="text-left">{row.getValue('content')}</div>
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const value = row.getValue("createdAt");

        if (!value || (typeof value !== "string" && typeof value !== "number" && !(value instanceof Date))) {
          return <div className="text-left">Not Available</div>;
        }

        const date = new Date(value);

        if (isNaN(date.getTime())) {
          return <div className="text-left">Invalid Date</div>;
        }

        const options: Intl.DateTimeFormatOptions = { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        };
        const formattedDate = date.toLocaleDateString(undefined, options);
        return <div className='text-left'>{formattedDate}</div>;
      }
    },
    {
      header: 'Actions',
      cell: ({row}) => (
        <div className="flex flex-row gap-2">
          <Link href={`/${row.original.id}`}>
            <Button variant="outline">View</Button>
          </Link>
          
          <UpdateDialog 
            isEditDialogOpen={isEditDialogOpen} 
            setIsEditDialogOpen={setIsEditDialogOpen} 
            post={row.original} 
            onUpdateSuccess={(id) => 
                setLocalPosts((prev) => prev.map((p) => 
                p.id === id ? {...p, title: row.getValue('title'), content: row.getValue('content')} : p
              ))
            }
          />

          <DeleteDialog isDeleteDialogOpen={isDeleteDialogOpen} setIsDeleteDialogOpen={setIsDeleteDialogOpen} post={row.original} onDeleteSuccess={(id) => setLocalPosts((prev) => prev.filter((p) => p.id !== id))} />
        </div>
      )
    }
  ]

  return (
    <div className="mt-10">
      <MainTable columns={columns} data={posts} />
    </div>
  );
};

export default PostTable;