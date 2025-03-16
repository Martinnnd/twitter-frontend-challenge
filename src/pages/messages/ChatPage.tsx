import React from 'react'
import { StyledUsersFeedContainer } from './components/StyledUsersFeedContainer'
import ChatMessages from './components/ChatMessages'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'

const socket = io("http://localhost:8080", {
  query: {
    token: localStorage.getItem("token") || "", // Envía el token guardado
  },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Socket conectado:", socket.id);
});

socket.on("error", (error) => {
  console.error("❌ Error de conexión con Socket:", error.message);
});
  
      

const ChatPage = () => {
    const { id } = useParams();

    return (
        <StyledUsersFeedContainer>
            <ChatMessages userId={id ? id : ''} socket={socket} />
        </StyledUsersFeedContainer>
    )
}

export default ChatPage