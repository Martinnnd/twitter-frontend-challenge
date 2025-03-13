import styled from "styled-components";

export const StyledChatHeader = styled.div`
    alignSelf: flex-start;
    display: flex;
    flex: row;
    width: 100%; 
    padding: 0px 15px;
    justifyContent: normal;
    gap: 35px;
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.colors.containerLine};
`

export const StyledChatInputContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: flex-end;
    overflow-y: hidden;
    overflow-x: hidden;
`