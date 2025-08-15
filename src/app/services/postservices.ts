"use server"

import { revalidateTag } from "next/cache";
import { Post } from "../types";
import { getServerSession } from "next-auth";
import { authOptions } from "../utils/authOptions";



const baseUrl = process.env.BASE_URL;

export const getPosts = async () => {
    
    const session = await getServerSession(authOptions);

    const response = await fetch(`${baseUrl}/api/posts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
        },
        cache: 'no-store',
        next: {
            tags: ['posts'],
        }
    });


    return response.json();
}

export const getPost = async (id: string) => {
    try {
        const res = await fetch(`${baseUrl}/api/posts/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
            next: {
                tags: ['posts'],
            }
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export const createPost = async (posts: Post) => {
    try {
        
        const session = await getServerSession(authOptions);


        const res = await fetch(`${baseUrl}/api/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.accessToken}`,
            },
            body: JSON.stringify(posts),
            cache: 'no-store',
        });

        
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Failed to create post');
        }

        revalidateTag('posts');

        return data;
    } catch (error) {
        console.error("Service error:", error)
    }
}


export const updatePost = async (posts: Post) => {
    try {
        const res = await fetch(`${baseUrl}/api/posts/${posts.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(posts),
            cache: 'no-store',
        });

        revalidateTag('posts');
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (id: string) => {
    try {
        const res = await fetch(`${baseUrl}/api/posts/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        revalidateTag('posts');
        return res.json();
    } catch (error) {
        console.log(error);
    }
}