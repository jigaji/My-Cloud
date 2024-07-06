import React, { useContext } from 'react';
import UsersList from './UsersList';
import './AdminPanel.css';

import useUserData from '../../plugin/useUserData';


const AdminPanel = () => {
  const isAdmin = useUserData().isAdmin;
  console.log(useUserData().isAdmin)
  console.log(!isAdmin)

  if (!isAdmin) {
    return (
      <div className="admin-panel--access-denied">
        <span className="content">You do not have access to the administration panel :(</span>
      </div>
    );
  }

  return <UsersList />;
}

export default AdminPanel;