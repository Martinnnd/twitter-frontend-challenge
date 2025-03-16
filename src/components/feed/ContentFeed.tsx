import React from "react";
import Feed from "./Feed";
import { useGetFeed } from "../../hooks/useGetFeed";

const ContentFeed = () => {
  const { posts, isLoading, fetchNextPage, hasNextPage } = useGetFeed();

  // 🔥 Asegurarse de que los posts sean un array plano y no anidado en pages
  const flatPosts = posts || [];

  return (
    <Feed 
      posts={flatPosts} 
      loading={isLoading} 
      fetchNextPage={fetchNextPage} 
      hasNextPage={hasNextPage}
    />
  );
};

export default ContentFeed;
