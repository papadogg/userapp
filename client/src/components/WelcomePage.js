import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as userActions from '../actions/users';
import UserList from './UserList';
import { Link } from 'react-router-dom';
import { Label, Input, FormGroup, Form, Alert } from 'reactstrap';
import UltimatePagination from 'react-ultimate-pagination-bootstrap-4';

class WelcomePage extends Component {
  
  state = {
    page: 1
  }
  
  static contextTypes = {
    router: PropTypes.object
  }
  
  onChange = (page) => {
    this.setState({
      page
    });
    this.context.router.history.push("/?page=" + page);
  }
  
  changeFilter = (e) => {
    this.props.userActions.filterUsers(e.target.value);
    this.setState({
      page: 1
    });
    if(this.state.page !== 1) {
      
    this.context.router.history.push("/");
    }
  }
  
  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const page = params.get('page') || 1;
    const pageToNum = parseInt(page,10);
    this.props.userActions.setPage(pageToNum);
    this.setState({
      page: pageToNum
    });
   
    if(this.props.auth.user.role === 'admin' && this.props.users.list.length === 0) {
      this.props.userActions.fetchUsers();
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if(this.props.location.search !== nextProps.location.search) {
    const params = new URLSearchParams(nextProps.location.search);
    const page = params.get('page') || 1;
    const pageToNum = parseInt(page,10);
    this.props.userActions.setPage(pageToNum);
    this.setState({
      page: pageToNum
    });
    }
    if(this.props.auth.user.role !== 'admin' && nextProps.auth.user.role === 'admin' && this.props.users.list.length === 0) {
      this.props.userActions.fetchUsers();
    }
    if(!this.props.users.error && nextProps.users.error) {
      this.timer = setTimeout(()=>{
        this.props.userActions.clearError();
      }, 2000);
    }
    
  }
  
  componentWillUnmount() {
    if(this.props.error) {
      this.props.userActions.clearError();
    }
    clearTimeout(this.timer);
  }
  
  render() {
    
    if(this.props.users.loadingData) {
      return <div>Loading</div>;
    }
    if(this.props.auth.userLoading === false && this.props.auth.user.role !== 'admin') {
      return <h3>Welcome{this.props.auth.authenticated ? ` ${this.props.auth.user.name}` : ""}! Log in as admin to see more</h3>;
    }
    let { currentPage, filter, list } = this.props.users;
    const users = list ? list.filter(user=> user.name.toLowerCase().indexOf(filter.toLowerCase()) > -1) : [];
    const usersPerPage = users.slice(currentPage*10 - 10, currentPage*10);
    const totalPages = Math.ceil(users.length/10);
    if(currentPage > totalPages) {
      currentPage = totalPages;
    }
    return (
      <div className="main">
        {this.props.users.error && <Alert color="danger">
          {this.props.users.error}
          </Alert>}
          {this.props.auth.user.role === 'admin' && <div>
          <div className="action-bar">
            <Form inline onSubmit={(e)=>e.preventDefault()}>
              <FormGroup>
                <Label for="filter">Search by name</Label>
                <Input autoFocus name="filter" id="filter" value={filter} onChange={this.changeFilter}/>
              </FormGroup>
            </Form>
            <Link className="new-user-btn" to="/users/new"><button className="btn btn-info">Add new user</button></Link>
            </div>
            <UserList users={usersPerPage} deleteUser={this.props.userActions.deleteUser}/>
            {users.length > 10 &&  <UltimatePagination 
                                      currentPage={currentPage} 
                                      totalPages={totalPages} 
                                      onChange={this.onChange}
            />}
        </div>}
      </div>
    );
    }
  }
  
const mapStateToProps = state => {
  return {
    users: state.users,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);