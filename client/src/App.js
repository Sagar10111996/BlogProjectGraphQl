import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import 'semantic-ui-css/semantic.min.css'
import './App.css'
import AuthRoute from './utils/AuthRoute';
import { AuthProvider } from './context/auth';
import { Container } from 'semantic-ui-react'
import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import SinglePost from './pages/SinglePost'


function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar></MenuBar>
          <Switch>
            <AuthRoute exact path='/login' component={Login} />
            <AuthRoute exact path='/register' component={Register} />
            <Route exact path='/' component={Home} />
            <Route exact path='/posts/:postId' component={SinglePost} />
          </Switch>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
