import React, { Component } from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import WelcomePage from './WelcomePage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import Header from './Header';
import UserCreate from './UserCreate';
import UserEdit from './UserEdit';

class App extends Component {
  render() {
    return (
      <div className="container">
        <Router>
          <div>
            <Header />
            <Route exact path="/" component={WelcomePage}/>
            <Route exact path="/login" component={LoginPage}/>
            <Route exact path="/signup" component={SignupPage}/>
            <Route exact path="/users/new" component={UserCreate}/>
            <Route exact path="/users/edit/:id" component={UserEdit}/>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
