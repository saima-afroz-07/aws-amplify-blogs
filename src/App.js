import './App.css';
import DisplayBlogs from './components/DisplayBlogs/DisplayBlogs';
import {Link, BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import DisplayPosts from './components/DisplayPosts/DisplayPosts';


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/"><DisplayBlogs /></Route>
          <Route path="/posts/:id"><DisplayPosts /></Route>
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;
