import PostForm from "../utils/PostForm"



const CreatePost = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <PostForm />
      </div>
    </div>
  )
}

export default CreatePost