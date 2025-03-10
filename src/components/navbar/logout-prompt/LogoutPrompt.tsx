import React, { useEffect, useRef, useState } from "react";
import Modal from "../../modal/Modal";
import logo from "../../../assets/logo.png";
import Button from "../../button/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SwitchButton from "../../switch/SwitchButton";
import { ButtonType } from "../../button/StyledButton";
import { StyledPromptContainer } from "./PromptContainer";
import { StyledContainer } from "../../common/Container";
import { StyledP } from "../../common/text";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import { User } from "../../../service";
import { useQuery } from "@tanstack/react-query";
import useOnClickOutside from "../../../hooks/useOnClickOutside";

interface LogoutPromptProps {
  show: boolean;
  setLogoutOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogoutPrompt = ({ show, setLogoutOpen }: LogoutPromptProps) => {
  const [showPrompt, setShowPrompt] = useState<boolean>(show);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const service = useHttpRequestService()
  const [user, setUser] = useState<User>()
  const ref = useRef<HTMLDivElement>(null)

  const userQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => service.me()
  })

  useOnClickOutside(ref, () => {
    setShowPrompt(false) 
    setLogoutOpen(false)
  })

  useEffect(() => {
    if (userQuery.status === 'success') {
      setUser(userQuery.data)
    }
  }, [userQuery.status, userQuery.data]);


  const handleClick = () => {
    setShowModal(true);
  };


  const handleLanguageChange = () => {
    if (i18n.language === "es") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("es");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/sign-in");
  };

  useEffect(() => {
    setShowPrompt(show);
  }, [show]);

  return (
    <>
      {showPrompt && (
        <div ref={!showModal ? ref : undefined }>
          <StyledPromptContainer>
            <StyledContainer
              flexDirection={"row"}
              gap={"16px"}
              borderBottom={"1px solid #ebeef0"}
              padding={"16px"}
              alignItems={"center"}
            >
              <StyledP primary>Es:</StyledP>
              <SwitchButton
                checked={i18n.language === "es"}
                onChange={handleLanguageChange}
              />
            </StyledContainer>
            <StyledContainer onClick={handleClick} alignItems={"center"}>
              <StyledP primary>{`${t("buttons.logout")} @${user?.username
                }`}</StyledP>
            </StyledContainer>
          </StyledPromptContainer>
        </div>

      )}
      <Modal
        show={showModal}
        text={t("modal-content.logout")}
        img={logo}
        title={t("modal-title.logout")}
        acceptButton={
          <Button
            buttonType={ButtonType.FOLLOW}
            text={t("buttons.logout")}
            size={"MEDIUM"}
            onClick={handleLogout}
          />
        }
        onClose={() => setShowModal(false)}

      />
    </>
  );
};

export default LogoutPrompt;