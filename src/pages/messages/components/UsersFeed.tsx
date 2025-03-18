import { StyledUserFeedContainer } from './StyledUserFeedContainer'
import { useGetMutuals } from '../../../hooks/useGetMutuals'
import UserMessage from './UserMessage';
import Loader from '../../../components/loader/Loader';


const UsersFeed = () => {
  const { mutuals, loading, error } = useGetMutuals();

  return (
    <>
      {loading && <Loader />}
      <StyledUserFeedContainer>
        {mutuals.map((user) => {
          return (<UserMessage key={user.id} id={user.id} name={user.name ? user.name : ''} username={user.username} createdAt={user.createdAt} profilePic={user.profilePicture ? user.profilePicture : null} />)
        })}
      </StyledUserFeedContainer>
    </>
  )
}

export default UsersFeed