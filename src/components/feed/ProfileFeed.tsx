import React from "react";
import Feed from "./Feed";
import { useGetProfilePosts } from "../../hooks/useGetProfilePosts";
import { StyledH5 } from "../common/text/H5";

const ProfileFeed = () => {
  const { posts, loading } = useGetProfilePosts();

  return (
    <>
      {posts.length > 0 ? <Feed posts={posts} loading={loading} /> :
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
          <StyledH5>No posts yet</StyledH5>
        </div>}
    </>
  );
};
export default ProfileFeed;