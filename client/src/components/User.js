import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'reactstrap';

const User = ({user, deleteUser}) => {
  const deleteHandler = () => {
    deleteUser(user.id);
  }
 
  return (
    <ListGroupItem>
       {user.name} <span><Link to={`/users/edit/${user.id}`}><button className="btn btn-warning">Edit</button></Link><button className="btn btn-danger" onClick={deleteHandler}>Delete</button></span>
    </ListGroupItem>
  );
  
}

export default User;
