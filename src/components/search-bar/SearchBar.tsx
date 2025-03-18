import React, { ChangeEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchResultModal from "./search-result-modal/SearchResultModal";
import { Author } from "../../service";
import { useHttpRequestService } from "../../service/HttpRequestService";
import { useTranslation } from "react-i18next";
import { StyledSearchBarContainer } from "./SearchBarContainer";
import { StyledSearchBarInput } from "./SearchBarInput";
import Loader from "../loader/Loader";

export const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const service = useHttpRequestService();
  const { t } = useTranslation();

  // Query para obtener resultados de la búsqueda de usuarios
  const { data: results, refetch, isFetching } = useQuery({
    queryKey: ["searchUsers", query],
    queryFn: () => service.searchUsers(query, 4, 0)
  });

  // Debounce para evitar llamadas excesivas
  let debounceTimer: NodeJS.Timeout;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputQuery = e.target.value;
    setQuery(inputQuery);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      refetch(); // Llamamos a refetch manualmente para realizar la consulta
    }, 300);
  };

  return (
    <StyledSearchBarContainer>
      <StyledSearchBarInput
        onChange={handleChange}
        value={query}
        placeholder={t("placeholder.search")}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <SearchResultModal show={query.length > 0} results={results || []} />
      )}
    </StyledSearchBarContainer>
  );
};
