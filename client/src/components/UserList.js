import React from 'react';
import User from './User';
import { ListGroup } from 'reactstrap';

const UserList = ({users, deleteUser}) => {
  return (
    <ListGroup>
      {users.map(user=><User key={user.id} user={user} deleteUser={deleteUser}/>)}
    </ListGroup>
  );
};

export default UserList;
