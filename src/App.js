import React, { Component } from 'react';
import './App.css';
import { Switch, Route, Link, withRouter } from 'react-router-dom'
import Login from './pages/login.js';
import HomePage from './pages/homepage.js';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      message: ""
    }
  }

  auth = async (req) => {
    let response = await axios.post('http://127.0.0.1:5000/authlogin', req);
    console.log(response.data)
    let resp = response.data;
    if(resp.code === -1){
      this.setState({message: resp.message})
      this.props.history.push({
        pathname: '/'
    })
    }
    else if(resp.code === 0){
      this.setState({message: resp.message})
      this.props.history.push({
        pathname: '/'
    })
    }
    else if(resp.code === 1){
      this.setState({username: req.username})
      this.setState({password: req.password})
      this.props.history.push({
        pathname: '/homepage'
    })
    }
  }

register = async (req) => {
  let response = await axios.post('http://127.0.0.1:5000/signup', req);
  console.log(response.data)
  let resp = response.data;
  this.setState({message: resp.message})
    this.props.history.push({
      pathname: '/'
  })
}

  render() {
    return (
			<Switch>
      	<Route exact path='/' render={() => <Login auth={this.auth} register={this.register} message={this.state.message} />} />
        <Route path="/homepage" render={() => this.state.username !== ""?<HomePage username={this.state.username} password={this.state.password}/>:<PleaseLogin />}/>
			</Switch>
    );
  }
}

const PleaseLogin = () => {
  return (
    <div>
      please 
      <Link to="/"> register/login</Link>
    </div>
  );
}

export default withRouter(App);
