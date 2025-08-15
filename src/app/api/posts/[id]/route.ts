import { db } from "@/db/db";
import { postsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const id = req.nextUrl.pathname.split("/").pop();
        if (!id) {
            return NextResponse.json({ error: 'No post ID provided' }, { status: 400 });
        }

        const data = await db.select().from(postsTable).where(
            eq(postsTable.id, id)
        );

        return NextResponse.json({success: true, data});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to get post' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const id = req.nextUrl.pathname.split("/").pop();
        if (!id) {
            return NextResponse.json({ error: 'No post ID provided' }, { status: 400 });
        }

        const body = await req.json();
        const updated = await db.update(postsTable).set({
            title: body.title,
            content: body.content,
        }).where(
            eq(postsTable.id, id)
        );
        return NextResponse.json(updated);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.pathname.split("/").pop();
        if (!id) {
            return NextResponse.json({ error: 'No post ID provided' }, { status: 400 });
        }
        const deleted = await db.delete(postsTable).where(
            eq(postsTable.id, id)
        );
        return NextResponse.json({ success: true, deleted });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}