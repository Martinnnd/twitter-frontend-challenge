import React from "react";
import styled, { keyframes } from "styled-components";

const spinAnimation = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const StyledLoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px; /* Adjust the height as needed */
`;

const StyledLoaderSpinner = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #ccc;
  margin-top: 100px;
  border-top-color: ${({ theme }) => theme.colors.main};
  animation: ${spinAnimation} 0.8s linear infinite;
`;

const Loader = () => {
  return (
    <StyledLoaderContainer>
      <StyledLoaderSpinner />
    </StyledLoaderContainer>
  );
};

export default Loader;
