import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Button from "../../../components/button/Button";
import { ButtonType } from "../../../components/button/StyledButton";
import { StyledChatFormContainer } from "./StyledChatFormContainer";
import { Socket } from "socket.io-client";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import user from "../../../redux/user";

interface ChatFormProps {
  receiverId: string;
  socket: Socket;
}

const ChatForm = ({ receiverId, socket }: ChatFormProps) => {
  const [room, setRoom] = useState<string | null>(null);

  const initialValues = {
    message: "",
  };

  const service = useHttpRequestService();
  const queryClient = useQueryClient();

  socket.on("message:receive", () => {
    queryClient.invalidateQueries({
      queryKey: ["chat"],
    });
  });

  const userQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => service.me(),
  });

  useEffect(() => {
    if (userQuery.status === "success") {
      setRoom(`${userQuery.data.id}-${receiverId}`);
    }
  }, [userQuery.status, userQuery.data]);

  useEffect(() => {
    if (socket.connected) {
      console.log("✅ Socket conectado con ID:", socket.id);
    } else {
      console.log("❌ Socket NO está conectado");
    }
  
    socket.on("connect", () => {
      console.log("🔗 Conectado al WebSocket");
    });
  
    socket.on("disconnect", () => {
      console.log("❌ Desconectado del WebSocket");
    });
  
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);
  

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        if (values.message.length === 0) {
        }
        const errors: Partial<{ message: string }> = {};
        return errors;
      }}
      onSubmit={async (values, { resetForm, setErrors, setSubmitting }) => {
        if (values.message.length !== 0) {
          if (room) {
            console.log("📤 Enviando mensaje a servidor:", { receiverId, message: values.message });
      
            socket.emit("message:send", receiverId, { message: values.message });
      
            socket.once("message:sent", () => {
              console.log("✅ Mensaje confirmado por el servidor");
              queryClient.invalidateQueries({ queryKey: ["chat"] });
              setSubmitting(false);
              resetForm();
            });
      
          } else {
            setErrors({ message: "Error sending message" });
          }
        }
      }}
      
      
    >
      <Form style={{ width: "94%", justifyContent: "center" }}>
        <StyledChatFormContainer>
          <Field
            style={{
              width: "100%",
              height: "25px",
              borderRadius: "20px", 
              border: "1px solid grey",
            }}
            id="message"
            name="message"
            autoComplete="off"
          />
          <Button
            text="Send"
            size="small"
            buttonType={ButtonType.OUTLINED}
            type="submit"
          />
        </StyledChatFormContainer>
      </Form>
    </Formik>
  );
};

export default ChatForm;
