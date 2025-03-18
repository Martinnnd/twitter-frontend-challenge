import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StyledTweetContainer } from "./TweetContainer";
import AuthorData from "./user-post-data/AuthorData";
import type { Post, User } from "../../service";
import { StyledReactionsContainer } from "./ReactionsContainer";
import Reaction from "./reaction/Reaction";
import { useHttpRequestService } from "../../service/HttpRequestService";
import { IconType } from "../icon/Icon";
import { StyledContainer } from "../common/Container";
import ThreeDots from "../common/ThreeDots";
import DeletePostModal from "./delete-post-modal/DeletePostModal";
import ImageContainer from "./tweet-image/ImageContainer";
import CommentModal from "../comment/comment-modal/CommentModal";
import { useNavigate } from "react-router-dom";

interface TweetProps {
  post: Post;
}

const Tweet = ({ post }: TweetProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const service = useHttpRequestService();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Query para obtener el usuario actual
  const { data: user } = useQuery<User>({
    queryKey: ["me"],
    queryFn: service.me,
  });

  // const { data: actualPost } = useQuery<Post>({
  //   queryKey: ["post", post.id],
  //   queryFn: async () => {
  //     const response = await service.getPostById(post.id);
  //     return { ...response, reactions: response.reactions ?? [] }; // Si reactions es undefined, se establece como un array vacío
  //   },
  // });

  const createReactionMutation = useMutation({
    mutationKey: ["createReaction"],
    mutationFn: async ({ id, type }: { id: string; type: string }) => {
      // Crear reacción en el backend
      const response = await service.createReaction(id, type);
      return response;  // Asegúrate de devolver la respuesta con el post actualizado
    },
    onSuccess: (data) => {
      // Actualiza el cache con el post actualizado que contiene la nueva reacción
      queryClient.setQueryData(["post", post.id], data);
    },
  });
  
  const deleteReactionMutation = useMutation({
    mutationKey: ["deleteReaction"],
    mutationFn: async ({ id, type }: { id: string; type: string }) => {
      // Eliminar reacción en el backend
      const response = await service.deleteReaction(id, type);
      return response;  // Asegúrate de devolver la respuesta con el post actualizado
    },
    onSuccess: (data) => {
      // Actualiza el cache con el post actualizado que contiene la reacción eliminada
      queryClient.setQueryData(["post", post.id], data);
    },
  });
  

  const getCountByType = (type: string): number => {
    // Verifica si post y post.reactions están definidos
    return post?.reactions?.filter((r) => r.type === type).length ?? 0;
  };

  const handleReaction = async (type: string) => {
    if (!post || !user) {
      console.error("El post o el usuario no están cargados.");
      return;
    }
  
    // Verifica si post.reactions está definido antes de continuar
    const reacted = post.reactions?.find(
      (r) => r.type === type && r.userId === user.id
    );
  
    try {
      if (reacted) {
        await deleteReactionMutation.mutateAsync({ id: post.id, type });
        // Eliminar la reacción del localStorage
        const updatedReactions = post.reactions.filter(
          (r) => r.type !== type || r.userId !== user.id
        );
        localStorage.setItem(`post-${post.id}-reactions`, JSON.stringify(updatedReactions));
      } else {
        const validType = type.toUpperCase();
        await createReactionMutation.mutateAsync({ id: post.id, type: validType });
        // Agregar la reacción al localStorage
        const newReactions = [
          ...post.reactions,
          { type: validType, userId: user.id },
        ];
        localStorage.setItem(`post-${post.id}-reactions`, JSON.stringify(newReactions));
      }
    } catch (error) {
      console.error("Error al manejar la reacción:", error);
    }
  };
  
  

  // Verifica si el usuario ha reaccionado a un post
  const hasReactedByType = (type: string): boolean => {
    return post?.reactions?.some(
      (r) => r.type === type && r.userId === user?.id
    ) ?? false;
  };

  if (!post || !user) return null;

  return (
    <StyledTweetContainer>
      <StyledContainer
        style={{ width: "100%" }}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        maxHeight={"48px"}
      >
        <AuthorData
          id={post.author.id}
          name={post.author.name ?? "Name"}
          username={post.author.username}
          createdAt={post.createdAt}
          profilePicture={post.author.profilePicture}
        />
        {post.authorId === user?.id && (
          <>
            <DeletePostModal
              show={showDeleteModal}
              id={post.id}
              onClose={() => setShowDeleteModal(false)}
            />
            <ThreeDots
              onClick={() => setShowDeleteModal(!showDeleteModal)}
            />
          </>
        )}
      </StyledContainer>
      <StyledContainer onClick={() => navigate(`/post/${post.id}`)}>
        <p>{post.content}</p>
      </StyledContainer>
      {post.images && post.images.length > 0 && (
        <StyledContainer padding={"0 0 0 10%"}>
          <ImageContainer images={post.images} />
        </StyledContainer>
      )}
      <StyledReactionsContainer>
        <Reaction
          img={IconType.CHAT}
          count={post?.comments?.length}
          reactionFunction={() =>
            window.innerWidth > 600
              ? setShowCommentModal(true)
              : navigate(`/compose/comment/${post.id}`)
          }
          increment={0}
          reacted={false}
        />
        <Reaction
          img={IconType.RETWEET}
          count={getCountByType("RETWEET")}
          reactionFunction={() => handleReaction("RETWEET")}
          increment={1}
          reacted={hasReactedByType("RETWEET")}
        />
        <Reaction
          img={IconType.LIKE}
          count={getCountByType("LIKE")}
          reactionFunction={() => handleReaction("LIKE")}
          increment={1}
          reacted={hasReactedByType("LIKE")}
        />
      </StyledReactionsContainer>
      <CommentModal
        show={showCommentModal}
        post={post}
        onClose={() => setShowCommentModal(false)}
      />
    </StyledTweetContainer>
  );
};

export default Tweet;
