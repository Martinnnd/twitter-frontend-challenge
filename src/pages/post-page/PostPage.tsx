import React, { useEffect, useState } from "react";
import { StyledContainer } from "../../components/common/Container";
import Tweet from "../../components/tweet/Tweet";
import Loader from "../../components/loader/Loader";
import { useHttpRequestService } from "../../service/HttpRequestService";
import TweetBox from "../../components/tweet-box/TweetBox";
import { StyledH5 } from "../../components/common/text";
import { StyledFeedContainer } from "../home-page/components/contentContainer/FeedContainer";
import CommentFeed from "../../components/feed/CommentFeed";

import { useQuery } from "@tanstack/react-query";
import { Post } from "../../service";



const PostPage = () => {
  const [postId, setPostId] = useState(window.location.href.split("/")[4]);
  const [post, setPost] = useState<Post>();
  const service = useHttpRequestService();

  const postQuery = useQuery({
    queryKey: ["post", postId],
    queryFn: (): Promise<Post> => service.getPostById(postId)
  })

  useEffect(() => {
    if(postQuery.status === 'success'){
      setPost(postQuery.data)
    }
  }, [postQuery.status, postQuery.data, postId])


  return (
    <StyledContainer borderRight={"1px solid #ebeef0"}>
      <StyledContainer
        padding={"16px"}
        borderBottom={"1px solid #ebeef0"}
        maxHeight={"53px"}
      >
        <StyledH5>Tweet</StyledH5>
      </StyledContainer>
      <StyledFeedContainer>
        {post ? (
          <>
            <Tweet post={post} />
            <StyledContainer
              borderBottom={"1px solid #ebeef0"}
              padding={"16px"}
            >
              <TweetBox parentId={postId} />
            </StyledContainer>

            <StyledContainer minHeight={"53.5vh"}>
              <CommentFeed postId={postId} />
            </StyledContainer>
          </>
        ) : (
          <StyledContainer justifyContent={"center"} alignItems={"center"}>
            <Loader />
          </StyledContainer>
        )}
      </StyledFeedContainer>
    </StyledContainer>
  )
}

export default PostPage