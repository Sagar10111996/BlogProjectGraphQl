import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

function DeleteButton ({ postId, callback, commentId }) {

  const [confirmOpen, setConfirmOpen] = useState(false);
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

  const [deletePostOrMutation] = useMutation(mutation, {
    variables: { postId, commentId },
    update: (proxy, result) => {
      setConfirmOpen(false)
      if (!commentId) {  
        const cachedData = proxy.readQuery({query: FETCH_POSTS_QUERY})
        let updatedData = {
          getPosts: [...cachedData.getPosts.filter(post => post.id != postId)]
        }
        proxy.writeQuery({query: FETCH_POSTS_QUERY, data: updatedData})
      }
      if(callback) callback()
      
    }
  })

  return (
    <>
      <Button 
          as='div'
          color='red'
          floated='right'
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{margin: 0}} />
        </Button>
        <Confirm 
          open={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={deletePostOrMutation}
        />
    </>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postID: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`

export default DeleteButton
