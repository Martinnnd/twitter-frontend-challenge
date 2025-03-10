import React, { useState } from "react";
import { DeleteIcon } from "../../icon/Icon";
import Modal from "../../modal/Modal";
import Button from "../../button/Button";
import { updateFeed } from "../../../redux/user";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import { useTranslation } from "react-i18next";
import { ButtonType } from "../../button/StyledButton";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Post } from "../../../service";
import { StyledDeletePostModalContainer } from "./DeletePostModalContainer";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import useToast from "../../../hooks/useToast";
import { ToastType } from "../../toast/Toast";

interface DeletePostModalProps {
  show: boolean;
  onClose: () => void;
  id: string;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({ show, id, onClose }) => {
  const feed = useAppSelector((state) => state.user.feed);
  const dispatch = useAppDispatch();
  const service = useHttpRequestService();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const addToast = useToast();
  const [showModal, setShowModal] = useState(false);

  const { mutateAsync: deletePost, status } = useMutation({
    mutationKey: ["deletePost", id],
    mutationFn: () => service.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["infinitePosts"] });
      dispatch(updateFeed(feed.filter((post: Post) => post.id !== id)));
      addToast({ message: t("toast.deleteTweet"), type: ToastType.ALERT, show: true });
      onClose();
    },
    onError: () => {
      addToast({ message: t("toast.error"), type: ToastType.ALERT, show: true });
    }
  });

  return (
    <>
      {show && (
        <>
          <StyledDeletePostModalContainer onClick={() => setShowModal(true)}>
            <DeleteIcon />
            <p>{t("buttons.delete")}</p>
          </StyledDeletePostModalContainer>
          <Modal
            title={t("modal-title.delete-post") + "?"}
            text={t("modal-content.delete-post")}
            show={showModal}
            onClose={onClose}
            acceptButton={
              <Button
                text={t("buttons.delete")}
                buttonType={ButtonType.DELETE}
                size={"MEDIUM"}
                onClick={() => deletePost()}
              />
            }
          />
        </>
      )}
    </>
  );
};

export default DeletePostModal;
