import { useQuery } from "@tanstack/react-query"
import { useHttpRequestService } from "../service/HttpRequestService";
import { useEffect, useState } from "react";
import { Message, User } from "../service";

export const useGetChatHistory = (userId: string) => {
    const service = useHttpRequestService();
    const [messages, setMessages] = useState<Message[]>([]);

    const messagesQuery = useQuery({
        queryKey: ["chat", userId],
        queryFn: () => service.getChatHistory(userId)
    });

    useEffect(()=>{
        if(messagesQuery.data) {
            setMessages(messagesQuery.data);
        }
    }, [messagesQuery.data, messagesQuery.status]);

    return {messages, loading: messagesQuery.isLoading, error: messagesQuery.isError, refetch: messagesQuery.refetch}
}