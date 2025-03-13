import React from 'react'
import AuthorData from '../../../components/tweet/user-post-data/AuthorData'
import { useGetChatHistory } from '../../../hooks/useGetChatHistory'
import { StyledUserMessageContainer } from './StyledUserMessageContainer'
import { Navigate, useNavigate } from 'react-router-dom'

interface UserMessageProps {
  id: string,
  name: string,
  username: string,
  createdAt: Date,
  profilePic: string | null

}

const UserMessage = ({ id, name, username, createdAt, profilePic }: UserMessageProps) => {
  const { messages, loading, error } = useGetChatHistory(id)

  const navigate = useNavigate();

  return (
    <StyledUserMessageContainer onClick={()=>navigate(`/messages/${id}`)}>
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
        <AuthorData id={id} name={name} username={username} createdAt={messages[messages.length - 1] ? messages[messages.length - 1].createdAt : null} profilePicture={profilePic} />
        {messages[messages.length - 1] && <p style={{
          marginLeft: '8px',
          padding: '4px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
          color: 'grey'
        }}>{messages[messages.length - 1].content}</p>}
      </div>

    </StyledUserMessageContainer>
  )
}

export default UserMessage