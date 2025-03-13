import styled from "styled-components";

export const StyledChatFormContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 1rem;
    border-top: 1px solid ${props => props.theme.colors.containerLine};
`