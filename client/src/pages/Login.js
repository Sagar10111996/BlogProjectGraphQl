import gql from 'graphql-tag'
import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { Form, Button } from 'semantic-ui-react'
import { useForm } from '../utils/useForm'
import { AuthContext } from '../context/auth'

function Login(props) {
  const [errors, setErrors] = useState({})
  const { values, onChange, onSubmit } = useForm({
    username: '',
    password: '',
  }, loginUserCallback) 
  const context = useContext(AuthContext)

  const [loginUser, {loading}] = useMutation(LOGIN_USER, {
    // update is triggered when the useMutation query is successfully 
    // proxy is rarely used contains the metadata and result is the result of query
    update(_, { data: { login: userData }}) {
      context.login(userData)
      props.history.push('/')
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors)
    },
    variables: values
  })

  function loginUserCallback() {
    loginUser()
  }

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading': ''}>
        <h1>Login</h1>
        <Form.Input 
          label='Username'
          placeholder='Username'
          name='username'
          type='text'
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input 
          label='Password'
          placeholder='Password'
          name='password'
          type='password'
          error={errors.password ? true : false}
          value={values.password}
          onChange={onChange}
        />
        <Button type='submit' primary>
          Login
        </Button>
      </Form>
      {
        Object.keys(errors).length > 0 && 
        (
          <div className='ui error message'>
            <ul className='list'>
              {Object.values(errors).map(value => {
                return (<li key={value}>{value}</li>)
              })}
            </ul>
          </div>
        )
      }
    </div>
  )
}

const LOGIN_USER = gql`
  mutation login (
    $username: String!
    $password: String!
  ) {
    login(
      loginInput: {
        username: $username
        password: $password
      }
    ) {
      id email username createdAt token
    }
  }
`

export default Login


