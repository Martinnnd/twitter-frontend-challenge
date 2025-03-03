import type { ChangeEvent } from "react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthWrapper from "../../../pages/auth/AuthWrapper";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import { ButtonType } from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";
import { setUser } from "../../../redux/user";

interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const [data, setData] = useState<Partial<SignUpData>>({});
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const httpRequestService = useHttpRequestService();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange =
    (prop: keyof SignUpData) => (event: ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [prop]: event.target.value });
    };

    const handleSubmit = async () => {
      if (data.password !== data.confirmPassword) {
        setError(t("error.password-mismatch"));
        return;
      }
    
      const { confirmPassword, ...requestData } = data;
    
      try {
        console.log("📤 Enviando datos a /auth/signup:", requestData);
        
        const response = await httpRequestService.signUp(requestData);
        
        console.log("✅ Respuesta del servidor:", response);
    
        const user = await httpRequestService.me(); 
        dispatch(setUser(user)); 
        navigate("/");
      } catch (error: any) {
        console.error("❌ Error en el registro:", error.response?.data || error);
        if (error.response?.data?.errors) {
          console.error("🔍 Detalles del error:", error.response.data.errors);
        }
        setError(error.response?.data?.message || t("error.register-failed"));
      }
    };
    
    

  return (
    <AuthWrapper>
      <div className={"border"}>
        <div className={"container"}>
          <div className={"header"}>
            <img src={logo} alt="Twitter Logo" />
            <StyledH3>{t("title.register")}</StyledH3>
          </div>
          <div className={"input-container"}>
            <LabeledInput
              required
              placeholder={t("input-params.name")}
              title={t("input-params.name")}
              error={!!error}
              onChange={handleChange("name")}
            />
            <LabeledInput
              required
              placeholder={t("input-params.username")}
              title={t("input-params.username")}
              error={!!error}
              onChange={handleChange("username")}
            />
            <LabeledInput
              required
              placeholder={t("input-params.email")}
              title={t("input-params.email")}
              error={!!error}
              onChange={handleChange("email")}
            />
            <LabeledInput
              type="password"
              required
              placeholder={t("input-params.password")}
              title={t("input-params.password")}
              error={!!error}
              onChange={handleChange("password")}
            />
            <LabeledInput
              type="password"
              required
              placeholder={t("input-params.confirm-password")}
              title={t("input-params.confirm-password")}
              error={!!error}
              onChange={handleChange("confirmPassword")}
            />
            {error && <p className="error-message">{error}</p>}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button
              text={t("buttons.register")}
              buttonType={ButtonType.FOLLOW}
              size={"MEDIUM"}
              onClick={handleSubmit}
            />
            <Button
              text={t("buttons.login")}
              buttonType={ButtonType.OUTLINED}
              size={"MEDIUM"}
              onClick={() => navigate("/sign-in")}
            />
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default SignUpPage;
