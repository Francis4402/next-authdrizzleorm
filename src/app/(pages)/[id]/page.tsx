import { getPost } from "@/app/services/postservices";



export async function generateMetadata({params}: {params: Promise<{id: string}>}) {
  const { id } = await params;

  const res = await getPost(id);


  const postData = res.data[0];
  
  console.log(postData);

  return {
    title: postData.title,
    description: postData.content
  }
}

const DetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  const response = await getPost(id);
  
  const post = response.data[0];

  if (!post) return <div>Post not found</div>;

  return (
    <div className="container mx-auto h-screen justify-center items-center">
        <h1 className="text-center text-4xl font-bold">{post.title}</h1>
        <p className="text-center">{post.content}</p>
    </div>
  );
};

export default DetailPage