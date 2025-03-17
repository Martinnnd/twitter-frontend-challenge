import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import AuthWrapper from "../AuthWrapper";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import { ButtonType } from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";
import { Formik } from "formik";
import { SingInData } from "../../../service";

const SignInPage = () => {
  const initialValues = {
    username: "",
    password: "",
  };

  const httpRequestService = useHttpRequestService();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (data: SingInData) => {
    try {
      await httpRequestService.signIn(data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        const errors: Partial<SingInData> = {};
        if (!values.username) {
          errors.username = "Username is required";
        }
        if (!values.password) {
          errors.password = "Password is required";
        }
        return errors;
      }}
      onSubmit={async (values, { resetForm, setErrors, setSubmitting }) => {
        try {
          await handleSubmit(values);
          resetForm();
          navigate('/');
        } catch (error) {
          setErrors({
            username: " ",
            password: "Invalid username or password",
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => (
        <AuthWrapper>
          <div className={"border"}>
            <form className={"container"} onSubmit={handleSubmit} noValidate>
              <div className={"header"}>
                <img src={logo} alt={"Twitter Logo"} />
                <StyledH3>{t("title.login")}</StyledH3>
              </div>
              <div className={"input-container"}>
                <LabeledInput
                  required
                  placeholder={"Username"}
                  title={t("input-params.username")}
                  error={!!errors.username}
                  onChange={handleChange}
                  errorMessage={errors.username}
                  value={values.username}
                  touched={touched.username}
                  onBlur={handleBlur}
                  name={"username"}
                />
                <LabeledInput
                  type="password"
                  required
                  placeholder={"Password"}
                  title={t("input-params.password")}
                  error={!!errors.password}
                  onChange={handleChange}
                  errorMessage={errors.password}
                  value={values.password}
                  touched={touched.password}
                  onBlur={handleBlur}
                  name={"password"}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  text={t("buttons.login")}
                  buttonType={ButtonType.FOLLOW}
                  size={"MEDIUM"}
                  type="submit"
                />
                <Button
                  text={t("buttons.register")}
                  buttonType={ButtonType.OUTLINED}
                  size={"MEDIUM"}
                  onClick={() => navigate("/sign-up")}
                  type="button"
                />
              </div>
            </form>
          </div>
        </AuthWrapper>
      )}
    </Formik>
  );
};

export default SignInPage;
