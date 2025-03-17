import React from "react";
import Feed from "./Feed";
import { useGetFeed } from "../../hooks/useGetFeed";

const ContentFeed = () => {
  const { posts, loading, fetchNextPage, hasNextPage } = useGetFeed();
  
  return <Feed posts={posts} loading={loading} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage}/>;
};
export default ContentFeed;