import styled from "styled-components";

export const StyledUserMessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-items: center;
    border-top: 1px solid ${props => props.theme.colors.containerLine};
    border-bottom: 1px solid #E6E9EA;
    width: 100%;
    cursor: pointer;
    overflow: hidden; 
    box-sizing: border-box; 
`;