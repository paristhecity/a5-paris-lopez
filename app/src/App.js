import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }




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
                    <pre id="state"> </pre>
                    <button id="login" type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
      );
    }
}

export default App;
