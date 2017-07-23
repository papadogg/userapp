import React, { Component } from 'react';
import * as userActions from '../actions/users';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { Button, Form, FormGroup, Label, Input, Col, Alert } from 'reactstrap';

class UserCreate extends Component {
  state = {
    name: '',
    password: '',
    email: '',
    redirect: false,
    error: ''
  }
  
  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  submitHandler = (e) => {
    e.preventDefault();
    const { name, password, email } = this.state;
    if(password === '' || email === '' || name === '') {
      this.setState({
        error: 'Fill all the fields'
      });
      return;
    }
    const user = {
      name,
      password,
      email
    };
    this.props.userActions.addNewUser(user);
    this.setState({
      redirect: true
    });
  }
  render() {
    if((this.props.auth.userLoading === false && this.props.auth.user.role !== 'admin') || this.state.redirect) {
      return <Redirect to="/"/>;
    }
     if(this.props.auth.userLoading === true && this.props.auth.user.role !== 'admin') {
      return <div></div>;
    }
    return (
      <div>{this.state.error && <Alert color="danger">
           {this.state.error}
        </Alert>}
      <Form className="auth-form" onSubmit={this.submitHandler}>
        <Col sm={{ size: 8, offset: 2 }}>
          <h2>Add new user</h2>
          <FormGroup>
            <Label for="name">Email</Label>
            <Input autoFocus type="text" name="name" id="name" placeholder="your name" value={this.state.name} onChange={this.changeHandler}/>
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" id="email" placeholder="email@example.com" value={this.state.email} onChange={this.changeHandler}/>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>{' '}
            <Input type="password" name="password" id="password" placeholder="******" value={this.state.password} onChange={this.changeHandler} />
          </FormGroup>
          <Button>Add</Button>
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
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserCreate);
