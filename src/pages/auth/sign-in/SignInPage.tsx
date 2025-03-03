import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/user";
import AuthWrapper from "../AuthWrapper";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import { ButtonType } from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";

const SignInPage = () => {
  const [identifier, setIdentifier] = useState(""); // Email o username
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const httpRequestService = useHttpRequestService();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await httpRequestService.signIn({
        email: identifier.includes("@") ? identifier : undefined,
        username: !identifier.includes("@") ? identifier : undefined,
        password,
      });

      const user = await httpRequestService.me(); // Obtener datos del usuario
      dispatch(setUser(user)); // Guardar en Redux

      navigate("/");
    } catch (err) {
      setError(t("username or password incorrect"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <div className="border">
        <div className="container">
          <div className="header">
            <img src={logo} alt="Twitter Logo" />
            <StyledH3>{t("title.login")}</StyledH3>
          </div>
          <div className="input-container">
            <LabeledInput
              required
              placeholder={t("username")}
              title={t("Username")}
              error={!!error}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <LabeledInput
              type="password"
              required
              placeholder={t("password")}
              title={t("input-params.password")}
              error={!!error}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button
              text={loading ? t("login") : t("login")}
              buttonType={ButtonType.FOLLOW}
              size="MEDIUM"
              onClick={handleSubmit}
              disabled={loading}
            />
            <Button
              text={t("buttons.register")}
              buttonType={ButtonType.OUTLINED}
              size="MEDIUM"
              onClick={() => navigate("/sign-up")}
            />
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default SignInPage;
