import React, { useContext } from 'react'
import { Card, Image, Button, Label, Icon, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'

function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes}}) {

  const { user } = useContext(AuthContext);

  const commentOnPost = () => {

  }

  return (
    <Card fluid style={{marginBottom: '2rem'}}>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Popup 
          content='Like on post' 
          trigger={<LikeButton user={user} post={{id, likes, likeCount}} />} 
        />
        
        <Popup 
          content='Comment on Post'
          inverted
          trigger={
            <Button as={Link} to={`/posts/${id}`} labelPosition='right'>
              <Button color='blue' basic onClick={commentOnPost}>
                <Icon name='comments' />
              </Button>
              <Label basic color='blue' pointing='left'>
                {commentCount}
              </Label>
            </Button>
          } />

        {
          user && user.username === username && <DeleteButton postId={id}  />
        }
      </Card.Content>
    </Card>
  )
}

export default PostCard