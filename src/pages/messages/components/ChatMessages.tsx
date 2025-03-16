import React, { useEffect, useRef, useState } from "react";
import { useGetChatHistory } from "../../../hooks/useGetChatHistory";
import { ChatContainer, ReceivedMessage, SentMessage } from "./StyledMessages";
import ChatForm from "./ChatForm";
import { Socket } from "socket.io-client";
import { User } from "../../../service";
import { useQuery } from "@tanstack/react-query";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import Avatar from "../../../components/common/avatar/Avatar";
import ProfileIcon from "../../../assets/icon.jpg";
import { useNavigate } from "react-router-dom";
import { StyledChatHeader, StyledChatInputContainer } from "./StyledChatStuff";
import { BackArrowIcon } from "../../../components/icon/Icon";

interface ChatMessagesProps {
  userId: string;
  socket: Socket;
}

const ChatMessages = ({ userId, socket }: ChatMessagesProps) => {
  const { messages, loading, error, refetch } = useGetChatHistory(userId);
  const [chatMessages, setChatMessages] = useState(messages);
  const [user, setUser] = useState<User | null>(null);
  const service = useHttpRequestService();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Obtener el usuario del chat
  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => service.getProfileView(userId),
  });

  const redirectToProfile = () => {
    navigate(`/profile/${userId}`);
  };

  // Desplazar al final del chat cuando haya un nuevo mensaje
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (userQuery.status === "success") {
      setUser(userQuery.data);
    }
  }, [userQuery.status, userQuery.data]);

  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  // 📌 Escuchar evento `new_message` para actualizar la conversación en tiempo real
  useEffect(() => {
    const handleNewMessage = (newMessage: any) => {
      console.log("📩 Nuevo mensaje recibido:", newMessage);
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollToBottom();
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket]);

  return (
    <>
      <StyledChatHeader>
        <BackArrowIcon onClick={() => navigate("/messages")} />
        <Avatar
          src={user?.profilePicture ? user.profilePicture : ProfileIcon}
          alt={user?.name ? user.name : ""}
          onClick={redirectToProfile}
        />
        <h2>{user?.name ? user.name : ""}</h2>
      </StyledChatHeader>

      <StyledChatInputContainer>
        <ChatContainer>
          {chatMessages.map((message, index) => (
            message.senderId !== userId ? (
              <SentMessage key={index}>{message.content}</SentMessage>
            ) : (
              <ReceivedMessage key={index}>{message.content}</ReceivedMessage>
            )
          ))}

          <div ref={chatEndRef} />
        </ChatContainer>

        <ChatForm receiverId={userId} socket={socket} setChatMessages={setChatMessages} />
      </StyledChatInputContainer>
    </>
  );
};

export default ChatMessages;
