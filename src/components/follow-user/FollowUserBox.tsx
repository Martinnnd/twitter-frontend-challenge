import {useEffect, useState} from "react";
import Button from "../button/Button";
import {useHttpRequestService} from "../../service/HttpRequestService";
import UserDataBox from "../user-data-box/UserDataBox";
import {useTranslation} from "react-i18next";
import {ButtonType} from "../button/StyledButton";
import {Follow} from "../../service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StyledFollowUserBoxContainer } from "./StyledFollowUserContainer";

interface FollowUserBoxProps {
  profilePicture?: string;
  name?: string;
  username?: string;
  id: string;
}

const FollowUserBox = ({
                         profilePicture,
                         name,
                         username,
                         id,
                       }: FollowUserBoxProps) => {
  const {t} = useTranslation();
  const service = useHttpRequestService()
  const queryClient = useQueryClient()
  const [isFollowing, setIsFollowing] = useState<boolean>();

  const followingQuery = useQuery({
    queryKey: ["following"],
    queryFn: () => service.getFollowing(id)
  })

  const followMutation = useMutation({
    mutationKey: ["follow", id],
    mutationFn: () => service.followUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["following"]
      })
      queryClient.invalidateQueries({
        queryKey: ["infinitePosts"]
      })
      setIsFollowing(true)
    }
  })

  const unfollowMutation = useMutation({
    mutationKey: ["unfollow", id],
    mutationFn: () => service.unfollowUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["following"]
      })
      queryClient.invalidateQueries({
        queryKey: ["infinitePosts"]
      })
      setIsFollowing(false)
    }
  })


  useEffect(() => {
    setIsFollowing(followingQuery.data?.some((follow: Follow) => follow.followedId === id))
  }, [followingQuery, followingQuery.data, followingQuery.status]);

  const handleFollow = async () => {
    if (isFollowing) {
      unfollowMutation.mutate()
    } else {
      followMutation.mutate()
    }
  };

  return (
      <StyledFollowUserBoxContainer>
        <UserDataBox
            id={id}
            name={name!}
            profilePicture={profilePicture!}
            username={username!}
        />
        <Button
            text={isFollowing ? t("buttons.unfollow") : t("buttons.follow")}
            buttonType={isFollowing ? ButtonType.DELETE : ButtonType.FOLLOW}
            size={"SMALL"}
            onClick={handleFollow}
        />
      </StyledFollowUserBoxContainer>
  );
};

export default FollowUserBox;