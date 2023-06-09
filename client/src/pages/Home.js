import React, { useContext} from 'react'
import { useQuery } from '@apollo/client'
import { Grid } from 'semantic-ui-react'
import { AuthContext } from '../context/auth'
import { FETCH_POSTS_QUERY } from '../utils/graphql'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'


function Home() {

  const {loading, data } = useQuery(FETCH_POSTS_QUERY)
  let posts = [];

  if (data) {
    posts = data.getPosts
  }

  const  { user } = useContext(AuthContext) 
  
  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>
      {
        user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )
      }
      <Grid.Row>
        {
          loading ? (
            <h1>Loading posts...</h1>
          ) : (
            posts && posts.map(post => {
              return (
                <Grid.Column key={post.id}>
                  <PostCard post={post} />
                </Grid.Column>
              )

            })
          )
        }
      </Grid.Row>
    </Grid>
  )
}

export default Home