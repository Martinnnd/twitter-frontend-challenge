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
    queryFn: () => service.getRecommendedUsers(6, 0),
    retry: 3, 
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <p>{t("loading")}</p>; 
  }

  if (isError) {
    return <p>{t("error.loading-users")}</p>; 
  }

  return (
    <StyledSuggestionBoxContainer>
      <h6>{t("suggestion.who-to-follow")}</h6>
      {users.length > 0 ? (
        users
          .filter((value, index, array) => array.indexOf(value) === index)
          .slice(0, 5)
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
        <p>{t("suggestion.no-recommendations")}</p> 
      )}
      {users.length > 5 && (
        <a href="/recommendations">{t("suggestion.show-more")}</a>
      )}
    </StyledSuggestionBoxContainer>
  );
};

export default SuggestionBox;
