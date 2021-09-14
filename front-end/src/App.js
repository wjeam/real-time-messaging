import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App"> 
        <Switch>
          <Route path="/login" exact component={Login}/>
          <Route path="/home" exact component={Home}/>
          <Route path="/register" exact component={Register}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
