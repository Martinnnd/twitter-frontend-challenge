import styled from 'styled-components';


export const SentMessage = styled.div`
  background-color: ${props => props.theme.colors.dark}; 
  padding: 10px;
  border-radius: 15px;
  color: white;
  margin-right: 15px;
  max-width: 80%;  
  align-self: flex-end;  
  text-align: right;    
  word-wrap: break-word; 
  @media (max-width: 600px) {
    max-width: 60%; 
  }
`;

export const ReceivedMessage = styled.div`
  background-color: ${props => props.theme.colors.light}; 
  padding: 10px;
  border-radius: 15px;
  margin-left: 18px;
  max-width: 80%;  
  align-self: flex-start;  
  text-align: left;    
  word-wrap: break-word; 
  @media (max-width: 600px) {
    max-width: 60%; 
  }
`;


export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 98%;
  height: 100%;
  max-height: 76vh;
  padding: 10px;
  gap: 5px;
  overflow-y: auto;
`;