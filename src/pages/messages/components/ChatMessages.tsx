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
  const { messages, loading, error } = useGetChatHistory(userId);
  const [chatMessages, setChatMessages] = useState(messages);
  const [user, setUser] = useState<User | null>(null);
  const service = useHttpRequestService();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Obtener el usuario autenticado
  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: () => service.me(),
  });

  const currentUserId = currentUser?.id;

  console.log("currentuserid", currentUserId);
  console.log("Mensajes recibidos:", messages);

  // Obtener el usuario con el que estamos chateando
  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => service.getProfileView(userId),
  });

  useEffect(() => {
    if (userQuery.status === "success") {
      setUser(userQuery.data);
    }
  }, [userQuery.status, userQuery.data]);

  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Escuchar evento `new_message`
  useEffect(() => {
    const handleNewMessage = (newMessage: any) => {
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
          alt={user?.name || ""}
          onClick={() => navigate(`/profile/${userId}`)}
        />
        <h2>{user?.name || ""}</h2>
      </StyledChatHeader>

      <StyledChatInputContainer>
        <ChatContainer>
          {chatMessages.map((message, index) => {
            console.log("📩 Mensaje completo:", message);

            const isSentMessage =
              message.senderId?.trim() === currentUserId?.trim();
            console.log("🔹 senderId:", message.senderId);
            console.log("🔹 currentUserId:", currentUserId);

            return (
              <React.Fragment key={index}>
                {isSentMessage ? (
                  <SentMessage>{message.content}</SentMessage> // Mensajes enviados → Derecha
                ) : (
                  <ReceivedMessage>{message.content}</ReceivedMessage> // Mensajes recibidos → Izquierda
                )}
              </React.Fragment>
            );
          })} 
          <div ref={chatEndRef} />
        </ChatContainer>

        <ChatForm
          receiverId={userId}
          socket={socket}
          setChatMessages={setChatMessages}
          currentUserId={currentUserId}
        />
      </StyledChatInputContainer>
    </>
  );
};


export default ChatMessages;
