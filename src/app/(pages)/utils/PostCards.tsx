
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PostCards = () => {


  return (
    <Card>
        <CardContent>
            <CardHeader>
                <CardTitle className="text-3xl">Posts</CardTitle>  
            </CardHeader>  
            <CardAction>
                <Link href="/create-post">
                    <Button>Create Post</Button>
                </Link> 
            </CardAction>
        </CardContent>
    </Card>
  )
}

export default PostCards