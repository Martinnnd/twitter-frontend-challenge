import React from "react";
import FollowUserBox from "../../../../components/follow-user/FollowUserBox";
import { useTranslation } from "react-i18next";
import { User } from "../../../../service";
import { StyledSuggestionBoxContainer } from "./SuggestionBoxContainer";
import { useQuery } from "@tanstack/react-query";
import { useHttpRequestService } from "../../../../service/HttpRequestService";

const SuggestionBox = () => {
  const service = useHttpRequestService();
  const { t } = useTranslation();

  // Usar useQuery para obtener los usuarios recomendados
  const { data: users = [], isLoading, isError } = useQuery<User[]>({
    queryKey: ["recommendedUsers"],
    queryFn: () => service.getRecommendedUsers(6, 0), // Llamada a la API para obtener los usuarios recomendados
    // Reintentar en caso de error si es necesario
    retry: 3, 
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <p>{t("loading")}</p>; // Puede mostrar un mensaje de carga mientras se obtienen los datos
  }

  if (isError) {
    return <p>{t("error.loading-users")}</p>; // Mostrar un mensaje de error si algo salió mal
  }

  return (
    <StyledSuggestionBoxContainer>
      <h6>{t("suggestion.who-to-follow")}</h6>
      {users.length > 0 ? (
        users
          .filter((value, index, array) => array.indexOf(value) === index) // Elimina duplicados
          .slice(0, 5) // Limita a 5 usuarios
          .map((user) => (
            <FollowUserBox
              key={user.id}
              id={user.id}
              name={user.name}
              username={user.username}
              profilePicture={user.profilePicture}
            />
          ))
      ) : (
        <p>{t("suggestion.no-recommendations")}</p> // Mensaje si no hay recomendaciones
      )}
      {users.length > 5 && (
        <a href="/recommendations">{t("suggestion.show-more")}</a> // Enlace si hay más de 5 usuarios recomendados
      )}
    </StyledSuggestionBoxContainer>
  );
};

export default SuggestionBox;
