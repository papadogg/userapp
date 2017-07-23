import React, { Component } from 'react';
import * as userActions from '../actions/users';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { Button, Form, FormGroup, Label, Input, Col, Alert } from 'reactstrap';

class UserEdit extends Component {
  state = {
    name: '',
    password: '',
    email: '',
    redirect: false,
    error: ''
  }
  
  componentDidMount() {
    const { list, userActions } = this.props;
    const { id } = this.props.match.params;
    if(list && list.length > 0) {
        const user = list.find(user=> user.id === parseInt(id, 10));
        const { name, password, email } = user;
        this.setState({
          name,
          password, 
          email
        });
    } else {
        userActions.fetchUsers();
    }
  }
  
  componentWillReceiveProps(nextProps) {
      if(this.props.list && this.props.list.length === 0 && nextProps.list.length > 0) {
        const { id } = this.props.match.params;
        const user = nextProps.list.find(user=> user.id === parseInt(id, 10));
        const { name, password, email } = user;
        this.setState({
          name,
          password, 
          email
        });
      }
  }
  
  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  submitHandler = (e) => {
    e.preventDefault();
    const { id } = this.props.match.params;
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
    this.props.userActions.editUser(parseInt(id, 10), user);
    this.setState({
      redirect: true
    });
  }
  render() {
    if(this.props.auth.userLoading === false && this.props.auth.user.role !== 'admin') {
      return <Redirect to="/"/>;
    }
    if(this.state.redirect) {
      if(this.props.history.length > 1) {
         this.props.history.goBack();
      } else {
        return <Redirect to="/"/>;
      }
        
      }
    if(this.props.auth.userLoading === true) {
      return <div></div>;
    }
    return (
      <div>{this.state.error && <Alert color="danger">
           {this.state.error}
        </Alert>}
       <Form className="auth-form" onSubmit={this.submitHandler}>
        <Col sm={{ size: 8, offset: 2 }}>
          <h2>Edit user</h2>
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
          <Button>Edit</Button>
        </Col>
      </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    list: state.users.list,
     auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);
