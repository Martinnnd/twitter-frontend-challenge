import type { ChangeEvent } from "react";
import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthWrapper from "../../../pages/auth/AuthWrapper";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import { ButtonType } from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";
import { Formik } from "formik";
import { AxiosError } from "axios";

interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const httpRequestService = useHttpRequestService();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues: SignUpData = {
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  const handleValidation = (values: SignUpData) => {
    let errors: Partial<SignUpData> = {};

    if (!values.name) {
      errors.name = "Name is required";
    }
    if (!values.username) {
      errors.username = "Username is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Invalid email format";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(values.password)) {
      errors.password = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    return errors;
  };

  const handleSubmit = async (data: SignUpData) => {
    try {
      const { confirmPassword, ...requestData } = data;
      await httpRequestService.signUp(requestData);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={handleValidation}
      onSubmit={async (values, { resetForm, setErrors, setSubmitting }) => {
        try {
          await handleSubmit(values);
          resetForm();
          navigate('/');
        } catch (e: any) {
          if (e.response.status === 409) {
            setErrors({
              username: " ",
              email: "Username or email already exists"
            });
          }
        }
      }}
    >
      {({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => (
        <AuthWrapper>
          <div className="border">
            <form className="container" onSubmit={handleSubmit} noValidate>
              <div className="header">
                <img src={logo} alt="Twitter Logo" />
                <StyledH3>{t("title.register")}</StyledH3>
              </div>
              <div className="input-container">
                <LabeledInput
                  required
                  placeholder={t("input-params.name")}
                  title={t("input-params.name")}
                  error={!!errors.name}
                  onChange={handleChange}
                  errorMessage={errors.name}
                  value={values.name}
                  touched={touched.name}
                  onBlur={handleBlur}
                  name="name"
                />
                <LabeledInput
                  required
                  placeholder={t("input-params.username")}
                  title={t("input-params.username")}
                  error={!!errors.username}
                  onChange={handleChange}
                  name="username"
                  value={values.username}
                  onBlur={handleBlur}
                  errorMessage={errors.username}
                  touched={touched.username}
                />
                <LabeledInput
                  required
                  placeholder={t("input-params.email")}
                  title={t("input-params.email")}
                  error={!!errors.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="email"
                  value={values.email}
                  errorMessage={errors.email}
                  touched={touched.email}
                />
                <LabeledInput
                  type="password"
                  required
                  placeholder={t("input-params.password")}
                  title={t("input-params.password")}
                  error={!!errors.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="password"
                  value={values.password}
                  errorMessage={errors.password}
                  touched={touched.password}
                />
                <LabeledInput
                  type="password"
                  required
                  placeholder={t("input-params.confirm-password")}
                  title={t("input-params.confirm-password")}
                  error={!!errors.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="confirmPassword"
                  value={values.confirmPassword}
                  errorMessage={errors.confirmPassword}
                  touched={touched.confirmPassword}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  text={t("buttons.register")}
                  buttonType={ButtonType.FOLLOW}
                  size="MEDIUM"
                  type="submit"
                />
                <Button
                  text={t("buttons.login")}
                  buttonType={ButtonType.OUTLINED}
                  size="MEDIUM"
                  onClick={() => navigate("/sign-in")}
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

export default SignUpPage;
