import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import '../App.css';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

class Login extends Component {

    constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			showPassword: ""
		}
    }
	
	logIn = () => {
		let req = {
			username: this.state.username,
			password: this.state.password
				}
		this.props.auth(req);
	}

	signUp = () => {
		let req = {
			username: this.state.username,
			password: this.state.password
				}
		this.props.register(req);
	}
	
	handleInput = (event) => {
		this.setState({[event.target.name]: event.target.value});
	}
	
	 handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  render() {

return (
	
    <div className="App">
        <Grid container spacing={16} style={{display: 'flex', justifyContent: 'center', verticalAlign: 'center'}}>
	  <Grid item xs={4} />
	  <Grid item xs={4}>
		<Grid container spacing={0} className="login-holder">
			<Grid item xs={12}>
					  <TextField
						  name="username"
						  label="User Name"
						  value={this.state.username}
						  onChange={this.handleInput}
						  margin="normal"
						/>
			</Grid>
			<Grid item xs={12}>
				<FormControl>
				  <InputLabel htmlFor="adornment-password">Password</InputLabel>
				  <Input
					id="adornment-password"
					name = "password"
					type={this.state.showPassword ? 'text' : 'password'}
					value={this.state.password}
					onChange={this.handleInput}
					endAdornment={
					  <InputAdornment position="end">
						<IconButton
						  aria-label="Toggle password visibility"
						  onClick={this.handleClickShowPassword}
						>
						  {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
						</IconButton>
					  </InputAdornment>
					}
				  />
				</FormControl>
			</Grid>
			<Grid item xs={12}>
					<Button variant="contained" name="signup" onClick={this.signUp}>
						SIGN UP
				     </Button>
					<Button variant="contained" name="login" onClick={this.logIn}>
					    LOG IN
				    </Button>
			</Grid>

		</Grid>
	  </Grid>
	  <Grid item xs={4} />
	  </Grid>
	  

		


	  
	  
		<div>{this.props.message !== "" ? this.props.message : ""}</div>
    </div>
);

  }

}

export default Login;