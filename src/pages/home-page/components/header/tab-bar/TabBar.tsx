import React, { useState } from "react";
import Tab from "./tab/Tab";
import { updateFeed } from "../../../../../redux/user";
import { useHttpRequestService } from "../../../../../service/HttpRequestService";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../redux/hooks";
import { StyledTabBarContainer } from "./TabBarContainer";

const TabBar = () => {
  const [activeFirstPage, setActiveFirstPage] = useState(true);
  const dispatch = useAppDispatch();
  const service = useHttpRequestService();
  const { t } = useTranslation();

  const handleClick = async (value: boolean, following: boolean) => {
    
    setActiveFirstPage(value);
    let data
    if(following){
      data = await service.getPostsFollowing().catch((e) => {
        console.log(e);
      });
      
    } else {
      const query = ""; // Replace with a valid query string or variable
      data = await service.getPosts(query).catch((e) => {
        console.log(e);
      });
      data = data.posts
    }
    dispatch(updateFeed([]))
    dispatch(updateFeed(data));
  };

  return (
    <>
      <StyledTabBarContainer>
        <Tab
          active={activeFirstPage}
          text={t("header.for-you")}
          onClick={() => handleClick(true, false)}
        />
        <Tab
          active={!activeFirstPage}
          text={t("header.following")}
          onClick={() => handleClick(false, true)}
        />
      </StyledTabBarContainer>
    </>
  );
};

export default TabBar;