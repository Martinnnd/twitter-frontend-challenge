import { useQuery } from "@tanstack/react-query"
import { useHttpRequestService } from "../service/HttpRequestService";
import { useEffect, useState } from "react";
import { User } from "../service";

export const useGetMutuals = () => {
    const service = useHttpRequestService();
    const [mutuals, setMutuals] = useState<User[]>([]);

    const mutualsQuery = useQuery({
        queryKey: ["mutuals"],
        queryFn: () => service.getMutuals()
    });

    useEffect(()=>{
        if(mutualsQuery.data) {
            setMutuals(mutualsQuery.data);
        }
    }, [mutualsQuery.data, mutualsQuery.status]);

    return {mutuals, loading: mutualsQuery.isLoading, error: mutualsQuery.isError}
}