import React, { Component } from 'react';
import * as authActions from '../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { Button, Form, FormGroup, Label, Input, Col, Alert } from 'reactstrap';

class LoginPage extends Component {
  state = {
    password: '',
    email: '',
    error: ''
  }
  
  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  submitHandler = (e) => {
    e.preventDefault();
    const { password, email } = this.state;
    if(password === '' || email === '') {
      this.setState({
        error: 'Fill all the fields'
      });
      return;
    }
    const user = {
      password,
      email
    };
    this.props.authActions.login(user);
  }
  render() {
    if(this.props.auth.authenticated) {
      return <Redirect to="/"/>;
    }
    return (
      <div>
        {this.state.error && <Alert color="danger">
           {this.state.error}
        </Alert>}
        {this.props.auth.loginError && <Alert color="danger">
          Wrong email or password
        </Alert>}
        <Form className="auth-form" onSubmit={this.submitHandler}>
          <Col sm={{ size: 8, offset: 2 }}>
            <h2>Log in</h2>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input autoFocus type="email" name="email" id="email" placeholder="email@example.com" value={this.state.email} onChange={this.changeHandler}/>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>{' '}
              <Input type="password" name="password" id="password" placeholder="******" value={this.state.password} onChange={this.changeHandler} />
            </FormGroup>
            <Button>Log in</Button>
          </Col>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
