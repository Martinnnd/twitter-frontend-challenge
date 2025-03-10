import React, {useEffect, useState} from "react";
import Button from "../button/Button";
import TweetInput from "../tweet-input/TweetInput";
import {useHttpRequestService} from "../../service/HttpRequestService";
import {setLength, updateFeed} from "../../redux/user";
import ImageContainer from "../tweet/tweet-image/ImageContainer";
import {BackArrowIcon} from "../icon/Icon";
import ImageInput from "../common/ImageInput";
import {useTranslation} from "react-i18next";
import {ButtonType} from "../button/StyledButton";
import {StyledTweetBoxContainer} from "./TweetBoxContainer";
import {StyledContainer} from "../common/Container";
import {StyledButtonContainer} from "./ButtonContainer";
import {useDispatch, useSelector} from "react-redux";
import {User} from "../../service";
import { RootState } from "../../redux/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useToastContext from "../../hooks/useToast";
import { ToastType } from "../toast/Toast";


interface TweetBoxProps {
    parentId?: string
    close?: ()=>void
    mobile?: boolean
    borderless?: boolean
}

const TweetBox = ({parentId, close, mobile}: TweetBoxProps) => {
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagesPreview, setImagesPreview] = useState<string[]>([]);
    const queryClient = useQueryClient()
    const {length, query} = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const service = useHttpRequestService()
    const [user, setUser] = useState<User>()
    const addToast = useToastContext()

    const postsQuery = useQuery({
        queryKey: ["posts", query],
        queryFn: () => service.getPosts(query)
    })


    const userQuery = useQuery({
        queryKey: ["me"],
        queryFn: () => service.me()
      })
    
    
      useEffect(() => {
        if(userQuery.status === 'success') {
          setUser(userQuery.data)
        }
      }, [userQuery.status, userQuery.data]);

    const createCommentMutation = useMutation({
        mutationKey: ["createComment"],
        mutationFn: ({content, images, parentId}: {content: string, images: string[], parentId: string}) => service.commentPost(parentId, content, images),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["infinitePosts"]
            })
            queryClient.invalidateQueries({
                queryKey: ["comments", data.postId]
            })
            queryClient.invalidateQueries({
                queryKey: ["post", data.postId]
            })
        }
    })

    const createPostMutation = useMutation({
        mutationKey: ["createPost"],
        mutationFn: ({content, images}: {content: string, images: string[]}) => service.createPost({content, images}),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["infinitePosts"]
            })
            
        }
    })
 

    useEffect(() => {
        if(postsQuery.status === "success"){
          dispatch(updateFeed(postsQuery.data));
          dispatch(setLength(postsQuery.data.length));
        }
    
      }, [postsQuery.status, postsQuery.data]);


    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if(e.target.value.length === 240){
            addToast({message: t("toast.maxChar"), type: ToastType.ALERT, show: true})
        }
        if(e.target.value.length <= 240){setContent(e.target.value);}
    };
    
    const handleSubmitImages = async (files: File[]): Promise<string[]> => {
        const imagesUrls: string[] = []

        for(const file of files){
            const res = await service.addImage(file.type)
            await service.putImage(file, res.putObjectUrl)
            imagesUrls.push(res.objectUrl)
        }

        return imagesUrls;
    }

    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((i, idx) => idx !== index);
        const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
        setImages(newImages);
        setImagesPreview(newImagesPreview);
    };

    const handleAddImage = (newImages: File[]) => {
        setImages(newImages);
        const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
        setImagesPreview(newImagesPreview);
    };

    const handleSubmit = async () => {
        try {
            const imagesUrls = await handleSubmitImages(images)
            if(parentId){
                createCommentMutation.mutate({content, images: imagesUrls, parentId})
            } else {
                createPostMutation.mutate({content, images: imagesUrls})
            }
            setContent("");
            setImages([]);
            setImagesPreview([]);
            dispatch(setLength(length + 1));
            addToast({message: t("toast.tweet"), type: ToastType.ALERT, show: true});
            close && close();
        } catch (e) {
            addToast({message: t("toast.error"), type: ToastType.ALERT, show: true})
        }
    };

    return (
        <StyledTweetBoxContainer>
            {mobile && (
                <StyledContainer
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <BackArrowIcon onClick={close}/>
                    <Button
                        text={"Tweet"}
                        buttonType={ButtonType.DEFAULT}
                        size={"SMALL"}
                        onClick={handleSubmit}
                        disabled={content.length === 0}
                    />
                </StyledContainer>
            )}
            <StyledContainer style={{width: "100%"}}>
                <TweetInput
                    onChange={handleChange}
                    maxLength={240}
                    placeholder={t("placeholder.tweet")}
                    value={content}
                    src={user?.profilePicture}
                />
                <StyledContainer padding={"0 0 0 10%"}>
                    <ImageContainer
                        editable
                        images={imagesPreview}
                        removeFunction={handleRemoveImage}
                    />
                </StyledContainer>
                <StyledButtonContainer>
                    <ImageInput setImages={handleAddImage} parentId={parentId}/>
                    {!mobile && (
                        <Button
                            text={"Tweet"}
                            buttonType={ButtonType.DEFAULT}
                            size={"SMALL"}
                            onClick={handleSubmit}
                            disabled={
                                content.length <= 0 ||
                                content.length > 240 ||
                                images.length > 4 ||
                                images.length < 0
                            }
                        />
                    )}
                </StyledButtonContainer>
            </StyledContainer>
        </StyledTweetBoxContainer>
    );
};

export default TweetBox;