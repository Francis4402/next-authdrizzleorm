
import React from 'react'
import { getPosts } from '../services/postservices'
import PostTable from './utils/PostTable';

const LoadPosts = async () => {

  const data = await getPosts();


  return (
    <div>
      <PostTable posts={data} />
    </div>
  )
}

export default LoadPosts