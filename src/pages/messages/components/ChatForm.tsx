import { Field, Form, Formik } from "formik";
import React from "react";
import Button from "../../../components/button/Button";
import { ButtonType } from "../../../components/button/StyledButton";
import { StyledChatFormContainer } from "./StyledChatFormContainer";
import { Socket } from "socket.io-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHttpRequestService } from "../../../service/HttpRequestService";

interface ChatFormProps {
  receiverId: string;
  socket: Socket;
  setChatMessages: React.Dispatch<React.SetStateAction<any[]>>;
  currentUserId: string | undefined;
}

const ChatForm = ({ receiverId, socket, setChatMessages, currentUserId }: ChatFormProps) => {
  const initialValues = { message: "" };
  const service = useHttpRequestService();
  const queryClient = useQueryClient(); // Para invalidar caché y refrescar mensajes

  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: { senderId: string; receiverId: string; content: string }) =>
      service.sendMessage(receiverId, newMessage.content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory", receiverId] });
    },
  });



  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        if (!values.message.trim() || !currentUserId) return;

        const newMessage = {
          from: currentUserId,  // 🔥 Aseguramos que "from" se asigne correctamente
          senderId: currentUserId,
          receiverId,
          content: values.message,
        };
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);

        // 📌 Enviar mensaje a través de WebSocket
        socket.emit("send_message", { 
          to: receiverId, 
          content: values.message,
          from: currentUserId // 🔥 Aseguramos que se envíe con el mismo formato que los recibidos
        });

        // 📌 Guardar mensaje en la base de datos
        sendMessageMutation.mutate(newMessage);

        resetForm();
        setSubmitting(false);
      }}
    >
      <Form style={{ width: "93%", justifyContent: "center" }}>
        <StyledChatFormContainer>
          <Field
            style={{
              width: "90%",
              height: "30px",
              borderRadius: "20px",
              border: "1px solid lightgray",
            }}
            id="message"
            name="message"
            autoComplete="off"
          />
          <Button text="Send" size="small" buttonType={ButtonType.OUTLINED} type="submit" />
        </StyledChatFormContainer>
      </Form>
    </Formik>
  );
};

export default ChatForm;
