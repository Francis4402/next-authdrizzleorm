/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@/db/db";
import { postsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const token = authHeader.split(" ")[1];

        let decoded;
        try {
          decoded = jwt.verify(token, process.env.AUTH_SECRET as string);
        } catch {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const userId = (decoded as any).id || (decoded as any).sub;
        
        const posts = await db.select().from(postsTable).where(eq(postsTable.authorId, userId));

        return NextResponse.json(posts);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {

      const authHeader = req.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const token = authHeader.split(" ")[1];
  
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.AUTH_SECRET as string);
      } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
  
      const body = await req.json();
  
      
      const existingPost = await db
        .select()
        .from(postsTable)
        .where(
          and(eq(postsTable.title, body.title), eq(postsTable.content, body.content))
        );
  
      if (existingPost.length > 0) {
        return NextResponse.json(
          { error: "Post with the same title and content already exists" },
          { status: 400 }
        );
      }

      const posts = await db
        .insert(postsTable)
        .values({
          title: body.title,
          content: body.content,
          authorId: (decoded as any).id || (decoded as any).sub,
        })
        .returning({
          title: postsTable.title,
          content: postsTable.content,
          authorId: postsTable.authorId,
        });
  
      return NextResponse.json(posts);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
