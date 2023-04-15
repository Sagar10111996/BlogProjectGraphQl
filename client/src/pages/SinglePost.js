import React, {useContext, useRef, useState} from 'react'
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import moment from 'moment'
import { Grid, Label, Button, Card, Image, Icon, Form } from 'semantic-ui-react'
import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'



function SinglePost(props) {
  const {user} = useContext(AuthContext)
  const commentInputRef = useRef(null)
  const [comment, setComment] = useState('')
  const postId = props.match.params.postId

  const {data: getPost} = useQuery(FETCH_POSTS_QUERY, {
    variables: { postId }
  })

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    variables: {
      postId,
      body: comment
    },
    update: () => {
      setComment('')
      commentInputRef.current.blur()
    }
  })



  const deletePostCallback = () => {
    props.history.push('/')
  }

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>loading post...</p>
  } else {
    const { 
      id, 
      body, 
      createdAt, 
      username, 
      comments, 
      likes, 
      likeCount, 
      commentCount } = getPost.getPost;
    
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated='right'
              size='mini'
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr/>
              <Card.Content>
                <LikeButton user={user} post={{id, likeCount, likes}} />
                <Button as='div' labelPostion='right' onClick={() => console.log('Comment on post')}>
                  <Button basic color='blue'>
                    <Icon name='comments' />
                  </Button>
                  <Label basic color='blue' pointing='left'>
                    {commentCount}
                  </Label>
                </Button>
                { user && user.username == username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {
              user && (
                <Card fluid>
                  <Card.Content>
                    <p>Post a comment</p>
                    <Form>
                      <div className='ui action input fluid'>
                        <input 
                          type='text' 
                          placeholder='Comment..'
                          value={comment}
                          onChange={event => setComment(event.target.value)}
                          ref={commentInputRef}
                        />
                        <button 
                          type='submit' 
                          className='ui button teal'
                          disabled={comment.trim() === ''}
                          onClick={submitComment}
                        >
                          Submit 
                        </button>
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              )
            }
            {
              comments.map((comment) => {
                return (
                  <Card fluid key={comment.id}>
                    <Card.Content>
                      { user && user.username === comment.username && (
                        <DeleteButton postId={id} commentId={comment.id}  />
                      )}
                      <Card.Header>{comments.username}</Card.Header>
                      <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                      <Card.Description>{comment.body}</Card.Description>
                    </Card.Content>
                  </Card>
                )
              })
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return postMarkup;

}

const FETCH_POSTS_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id body createdAt username likeCount
      likes {
        username
      }
      commentCount
      comments {
        id username createdAt body
      }
    }
  }
`

const SUBMIT_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id body createdAt username
      }
      commentCount
    }
  }
`

export default SinglePost