import UsersFeed from './components/UsersFeed'
import { StyledUsersFeedContainer } from './components/StyledUsersFeedContainer'


const MessagesPage = () => {

    return (
            <StyledUsersFeedContainer>
                <h1 style={{
                    color: 'black',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>Messages</h1>
                <UsersFeed />
            </StyledUsersFeedContainer>
    )
}

export default MessagesPage