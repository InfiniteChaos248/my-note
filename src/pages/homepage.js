import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notes: []
        }
    }

    componentWillMount = async () => {
        let req = {
			username: this.props.username,
			password: this.props.password
        }
        console.log(req)
		let response = await axios.post('http://127.0.0.1:5000/getNotes', req);
		this.setState({notes: response.data})
		console.log(response.data)
    }

    render() {

            return (
                <div>
                    <div>Welcome {this.props.username}</div>
                    <Link to="/">logout</Link>
                    {this.state.notes.map(n => {
                        return <p>{n.title}</p>;
                    })}
                    {this.state.notes.length === 0 ? <div>No notes added.</div>: ""}
                </div>
            );

    }

}

export default HomePage;