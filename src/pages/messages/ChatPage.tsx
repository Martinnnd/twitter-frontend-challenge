import React from 'react'
import { StyledUsersFeedContainer } from './components/StyledUsersFeedContainer'
import ChatMessages from './components/ChatMessages'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'

const socket = io("http://localhost:8080", {
    query: {
      token: localStorage.getItem("token") || "", // Evita undefined
    },
    transports: ["websocket"],
  });
  
  socket.on("connect", () => {
    console.log("✅ Socket conectado correctamente");
  });
  
  socket.on("error", (error) => {
    console.error("❌ Error en Socket:", error);
  });
  
  socket.on("connect_error", (err) => {
    console.error("❌ Error de conexión con Socket:", err.message);
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