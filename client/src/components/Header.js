import React, { Component } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as userActions from '../actions/users';
import * as authActions from '../actions/auth';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap';


class Header extends Component {
  
  state = {
    isOpen: false
  };
  
  componentDidMount() {
    this.props.authActions.getUser();
  }
  
  logout = (e) => {
    e.preventDefault();
    this.props.authActions.logout();
  }
  
  toggle =() => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  
  
  render() {
    return (
        <Navbar color="faded" light toggleable>
          <NavbarToggler right onClick={this.toggle} />
          <Link className="navbar-brand" to="/">UserApp</Link>
          <Collapse isOpen={this.state.isOpen} navbar>
            {!this.props.auth.userLoading && <Nav className="ml-auto" navbar>
              {!this.props.auth.authenticated ?
                <NavItem>
                  <NavLink   className="nav-link" to="/login">Log in</NavLink >
                </NavItem> : 
                <NavItem>
                  <span className="nav-link">Hello, {this.props.auth.user.name}</span>
                </NavItem>
              }
              {!this.props.auth.authenticated ?
                <NavItem>
                  <NavLink  className="nav-link" to="/signup">Sign up</NavLink >
                </NavItem> : 
                <NavItem>
                  <Link to="" className="nav-link" onClick={this.logout}>
                    Log out
                  </Link>
                </NavItem>
              }
            </Nav>}
          </Collapse>
        </Navbar>
   
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
    userActions: bindActionCreators(userActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));