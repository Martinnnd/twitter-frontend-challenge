import React from "react";
import Feed from "./Feed";
import { useGetFeed } from "../../hooks/useGetFeed";

const ContentFeed = () => {
  const { posts, isLoading } = useGetFeed();

  return <Feed posts={posts} loading={isLoading} />;
};
export default ContentFeed;
