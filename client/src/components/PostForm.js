import React from "react"; 
import { Form, Button } from "semantic-ui-react";
import { useForm } from "../utils/useForm";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

function PostForm () {

  const { values, onChange, onSubmit} = useForm({ body: '' }, createPostCallback)

  const [createPost, { error }] = useMutation(CREATE_POSTS_MUTATION, {
    update: (proxy, result) => {
        const cachedData = proxy.readQuery({ query: FETCH_POSTS_QUERY })
        let updatedData = {
          getPosts: [result.data.createPost, ...cachedData.getPosts]
        }
        console.log(updatedData)
        proxy.writeQuery({query: FETCH_POSTS_QUERY, data: updatedData})
        values.body = ''
    },
    variables: values
  })

  function createPostCallback() {
    createPost()
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input 
            placeholder="Hi world"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
        </Form.Field>
        <Button type="submit" color="teal">Submit</Button>
      </Form>
      { error && (
          <div className="ui error message" style={{marginBottom: 20}}>
            <ul className="list">
              <li>{error.graphQLErrors[0].message}</li>
            </ul>
          </div>     
      )}
    </>
  )
}

const CREATE_POSTS_MUTATION = gql`
  mutation createPost ($body: String!) {
    createPost(body:$body) {  
      id body createdAt username
      likes {
        id username createdAt
      }
      likeCount
      comments {
        id body username createdAt
      }
    }
  }
`

export default PostForm;