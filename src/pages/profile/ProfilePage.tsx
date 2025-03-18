import React, {useEffect, useState} from "react";
import ProfileInfo from "./ProfileInfo";
import {useNavigate, useParams} from "react-router-dom";
import Modal from "../../components/modal/Modal";
import {useTranslation} from "react-i18next";
import {User, Follow} from "../../service";
import {ButtonType} from "../../components/button/StyledButton";
import {useHttpRequestService} from "../../service/HttpRequestService";
import Button from "../../components/button/Button";
import ProfileFeed from "../../components/feed/ProfileFeed";
import {StyledContainer} from "../../components/common/Container";
import {StyledH5} from "../../components/common/text";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { ToastType } from "../../components/toast/Toast";
import useToast from "../../hooks/useToast";

const ProfilePage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [following, setFollowing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalValues, setModalValues] = useState({
    text: "",
    title: "",
    type: ButtonType.DEFAULT,
    buttonText: "",
  });
  const service = useHttpRequestService()
  const [user, setUser] = useState<User>()

  const id = useParams().id;
  const navigate = useNavigate();

  const { t } = useTranslation();
  const queryClient = useQueryClient()

  const addToast = useToast()

  const followingQuery = useQuery({
    queryKey: ["following", user?.id], 
    queryFn: () => user?.id && service.getFollowing(user.id),
    enabled: !!user?.id 
  });


  const followMutation = useMutation({
    mutationKey: ["follow", id],
    mutationFn: ({ id }: { id: string }) => service.followUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["following"]
      })
      setFollowing(true)
    }
  })

  const unfollowMutation = useMutation({
    mutationKey: ["unfollow", id],
    mutationFn: ({ id }: { id: string }) => service.unfollowUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["following"]
      })
      setFollowing(false)
      setShowModal(false);
      getProfileData();
    }
  })

  const deleteProfileMutation = useMutation({
    mutationKey: ["deleteProfile"],
    mutationFn: () => service.deleteProfile(),
    onSuccess: () => {
      addToast({ message: t("Profile deleted"), type: ToastType.SUCCESS, show: true })
      navigate("/sign-in");
    }
  })

  const userQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => service.me()
  })

  const profileDataQuery = useQuery({
    queryKey: ["profile", id],
    queryFn: () => id && service.getProfile(id)
  })

  const profileViewQuery = useQuery({
    queryKey: ["profileView", id],
    queryFn: () => id && service.getProfileView(id)
  })

  useEffect(() => {
    if (userQuery.status === 'success') {
      setUser(userQuery.data)
    }
  }, [userQuery.status, userQuery.data]);

  useEffect(() => {
    setFollowing(followingQuery.data?.some((follow: Follow) => follow.followedId === profileDataQuery.data?.id))
  }, [followingQuery.status, followingQuery.data])

  const handleButtonType = (): { component: ButtonType; text: string } => {
    if (profile?.id === user?.id)
      return { component: ButtonType.DELETE, text: t("buttons.delete") };
    if (following)
      return { component: ButtonType.OUTLINED, text: t("buttons.unfollow") };
    else return { component: ButtonType.FOLLOW, text: t("buttons.follow") };
  };

  const handleSubmit = async () => {
    if (profile?.id === user?.id) {
      deleteProfileMutation.mutate();
    } else {
      setFollowing(false); // ✅ Cambia inmediatamente la UI
      await unfollowMutation.mutateAsync({ id: profile!.id });
      setShowModal(false);
    }
  };
  

  useEffect(() => {
    if (profileDataQuery.status === "success" && followingQuery.status === "success") {
      setProfile({
        ...profileDataQuery.data.user,
        private: !profileDataQuery.data.user.publicAccount,
      });
  
      // Verifica correctamente si el usuario está en la lista de seguidos
      const isFollowing = followingQuery.data.some(
        (follow: Follow) => follow.followedId === profileDataQuery.data.user.id
      );
  
      setFollowing(isFollowing);
    }
  }, [profileDataQuery.status, profileDataQuery.data, followingQuery.status, followingQuery.data]);
  

  if (!id) return null;

  const handleButtonAction = async () => {
    if (profile?.id === user?.id) {
      setShowModal(true);
      setModalValues({
        title: t("modal-title.delete-account"),
        text: t("modal-content.delete-account"),
        type: ButtonType.DELETE,
        buttonText: t("buttons.delete"),
      });
    } else {
      if (following) {
        setShowModal(true);
        setModalValues({
          text: t("modal-content.unfollow"),
          title: `${t("modal-title.unfollow")} @${profile?.username}?`,
          type: ButtonType.FOLLOW,
          buttonText: t("buttons.unfollow"),
        });
      } else {
        setFollowing(true); // ✅ Refleja inmediatamente el cambio en la UI
        await followMutation.mutateAsync({ id: profile!.id });
      }
    }
  };
  

  const getProfileData = async () => {
    if (profileDataQuery.status === 'success') {

      setProfile({ ...profileDataQuery.data, private: !profileDataQuery.data.publicAccount })
      setFollowing(followingQuery.data?.some((follow: Follow) => follow.followedId === profileDataQuery.data?.id))
    }
    setProfile(profileDataQuery.data)
    setFollowing(followingQuery.data?.some((follow: Follow) => follow.followedId === profileDataQuery.data?.id))

  };

  return (
    <>
      <StyledContainer
        maxHeight={"100vh"}
        borderRight={"1px solid #ebeef0"}
        maxWidth={'600px'}
      >
        {profile && (
          <>
            <StyledContainer
              borderBottom={"1px solid #ebeef0"}
              maxHeight={"212px"}
              padding={"16px"}
            >
              <StyledContainer
                alignItems={"center"}
                padding={"24px 0 0 0"}
                flexDirection={"row"}
              >
                <ProfileInfo
                  name={profile!.name!}
                  username={profile!.username}
                  profilePicture={profile!.profilePicture}
                />
                <Button
                  buttonType={handleButtonType().component}
                  size={"100px"}
                  onClick={handleButtonAction}
                  text={handleButtonType().text}
                />
              </StyledContainer>
            </StyledContainer>
            <StyledContainer width={"100%"}>
              {!profile.private || !following ? (
                <ProfileFeed />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                  <StyledH5>Private account</StyledH5>
                </div>
              )}
            </StyledContainer>
            <Modal
              show={showModal}
              text={modalValues.text}
              title={modalValues.title}
              acceptButton={
                <Button
                  buttonType={modalValues.type}
                  text={modalValues.buttonText}
                  size={"MEDIUM"}
                  onClick={handleSubmit}
                />
              }
              onClose={() => {
                setShowModal(false);
              }}
            />
          </>
        )}
      </StyledContainer>
    </>
  );
};

export default ProfilePage;
