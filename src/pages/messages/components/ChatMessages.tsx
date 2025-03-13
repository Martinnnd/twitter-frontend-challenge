import React, { useEffect, useRef, useState } from 'react'
import { useGetChatHistory } from '../../../hooks/useGetChatHistory'
import { ChatContainer, ReceivedMessage, SentMessage } from './StyledMessages'
import ChatForm from './ChatForm'
import { Socket } from 'socket.io-client'
import { User } from '../../../service'
import { useQuery } from '@tanstack/react-query'
import { useHttpRequestService } from '../../../service/HttpRequestService'
import Avatar from '../../../components/common/avatar/Avatar'
import ProfileIcon from "../../../assets/icon.jpg";
import { useNavigate } from 'react-router-dom'
import { StyledChatHeader, StyledChatInputContainer } from './StyledChatStuff'
import { BackArrowIcon, Icon } from '../../../components/icon/Icon'

interface ChatMessagesProps {
  userId: string
  socket: Socket
}


const ChatMessages = ({ userId, socket }: ChatMessagesProps) => {
  const { messages, loading, error, refetch } = useGetChatHistory(userId)
  const [user, setUser] = useState<User | null>(null)
  const service = useHttpRequestService();
  const navigate = useNavigate();

  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => service.getProfileView(userId)
  })

  const redirectToProfile = () => {
    navigate(`/profile/${userId}`);
  };

  const chatEndRef = useRef<HTMLDivElement|null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();  
  }, [messages]);

  useEffect(() => {
    if (userQuery.status === 'success') {
      setUser(userQuery.data)
    }
  }, [userQuery.status, userQuery.data])

  return (
    <>
      <StyledChatHeader>
        <BackArrowIcon onClick={()=>navigate('/messages')} />
        <Avatar
          src={user?.profilePicture ? user.profilePicture : ProfileIcon}
          alt={user?.name ? user.name : ''}
          onClick={redirectToProfile}
        />
        <h2>{user?.name ? user.name : ''}</h2>
      </StyledChatHeader>
      <StyledChatInputContainer>
        <ChatContainer>
          {messages.map((message, index) => {
            if (message.senderId !== userId) {
              return <SentMessage key={index}>{message.content}</SentMessage>
            } else {
              return <ReceivedMessage key={index}>{message.content}</ReceivedMessage>
            }
          })}

          <div ref={chatEndRef}/>

        </ChatContainer>
        
        <ChatForm receiverId={userId} socket={socket} />
        
      </StyledChatInputContainer>

    </>

  )
}

export default ChatMessages