import styled from "styled-components";
import { ToastType } from "./Toast";
import { Theme } from "../../util/LightTheme";

interface ToastContainerProps {
  type: ToastType;
  theme: Theme;
}

export const StyledToastContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  margin: auto;
  width: 250px;
  padding: 8px 16px;
  align-items: center;
  justify-items: between;
  gap: 20px;
  position: fixed;
  border-radius: 8px;
  border: 1px solid
    ${(props: ToastContainerProps) => {
      switch (props.type) {
        case ToastType.ALERT:
          return props.theme.colors.errorContainer;
        default:
          return props.theme.colors.errorContainer;
      }
    }};
  background: ${(props: ToastContainerProps) => props.theme.background};

  p {
    color: ${(props: ToastContainerProps) => {
      switch (props.type) {
        case ToastType.ALERT:
          return props.theme.colors.errorContainer;
        default:
          return props.theme.colors.errorContainer;
      }
    }};
    margin: 0;
    font-variant-numeric: lining-nums tabular-nums;
    /* Body-2 */
    font-family: ${({ theme }) => theme.font.default};
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 13.2px */
    letter-spacing: -0.12px;
  }
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }
`;
