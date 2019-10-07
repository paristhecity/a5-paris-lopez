import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Link, Router} from 'react-router-dom';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        const state  = document.querySelector('#state');

        const body = { username: username, password: password };
        console.log(body);
        fetch('/login', {
            method: 'POST',
            body: body,
            headers: { 'Content-Type': 'application/json' }
        })
        .then( response => {
            console.log(response);
            window.location.href = 'home.js'
        })
        .catch(err => {
            console.log(err);
            state.innerHTML = "Incorrect Username or Password";
        });
        return false;
    };

    render() {
      return (
        <div className="App">
            <div className="container d-flex justify-content-md-center align-middle shadow p-3 mb-5 bg-white rounded">
                <form>
                    <div className="form-group">
                        <h1>
                            Teacher Login
                        </h1>
                    </div>

                    <div className="form-group">
                        <label htmlFor="exampleInputUsername">Username</label>
                        <input type="email" className="form-control" id="username" aria-describedby="emailHelp"
                               placeholder="Enter email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Password"/>
                    </div>
                    <button id="login" type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
                    <pre id="state"> </pre>
                </form>
            </div>
        </div>
      );
    }
}

export default App;
