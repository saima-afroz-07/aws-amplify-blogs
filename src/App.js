import './App.css';
import DisplayBlogs from './components/DisplayBlogs/DisplayBlogs';
import {Link, BrowserRouter as Router, Route, Switch, useHistory, Redirect} from 'react-router-dom'
import DisplayPosts from './components/DisplayPosts/DisplayPosts';
import Login from './components/Login';
import Signup from './components/Signup';
// import {withAuthenticator} from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import { useEffect , useState} from 'react';
import { Hub } from 'aws-amplify';
import ConfirmSignup from './components/ConfirmSignup/ConfirmSignup';
import ResetPassword from './components/ResetPassword/ResetPassword';
import PrivateRouter from './components/PrivateRouter/PrivateRouter';


Hub.listen('auth', (data) => {
  switch (data.payload.event) {
    case 'signIn':
        console.log('user signed in');
        break;
    case 'signUp':
        console.log('user signed up');
        break;
    case 'signOut':
        console.log('user signed out');
        break;
    case 'signIn_failure':
        console.log('user sign in failed');
        break;
    case 'configured':
        console.log('the Auth module is configured');
  }
});

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

  const accessLoginState = () => {
    Auth.currentAuthenticatedUser().then(res => {
      console.log(res);
      setLoggedIn(true);
    }).catch(err => {
      console.log("error => ",err);
      setLoggedIn(false);
      // history.push("/login");
    })
  }

  useEffect(() => {
    accessLoginState();
  }, []);
  
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/login"><Login /></Route>
          <Route exact path="/signup"><Signup /></Route>
          <Route exact path="/confirm-signup"><ConfirmSignup /></Route>
          <Route exact path="/reset-password"><ResetPassword /></Route>
        
          <PrivateRouter exact path="/"><DisplayBlogs /></PrivateRouter>
          <PrivateRouter path="/posts/:id"><DisplayPosts /></PrivateRouter>
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;
