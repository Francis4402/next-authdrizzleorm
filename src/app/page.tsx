import { Button } from "@/components/ui/button"
import LoadPosts from "./(pages)/LoadPosts"
import Link from "next/link"


const page = () => {
  return (
    <div className="space-y-10 text-end">
      <div>
        <Link href="/create-post"><Button variant={"outline"}>Create Post</Button></Link>
        <LoadPosts />
      </div>
    </div>
  )
}

export default page