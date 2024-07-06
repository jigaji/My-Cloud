import React, { useEffect, useState } from 'react';
import { MDBCheckbox } from 'mdb-react-ui-kit';
import apiInstance from '../../utils/axios';
import Swal from "sweetalert2";
import './AdminPanel.css';


function UsersList() {
  const [users, setUsers] = useState([]);
  const [optionsVisible, setOptionsVisible] = useState(null);




  const fetchData = async () => {
    const response = await apiInstance.get(`admin/users/`);
    console.log(response)
    const data =  response.data;
    setUsers(data)
  };

  useEffect(() => {
    fetchData();
  }, []);


  const HandleChange = async(id, index) => {
    console.log(index)
    const formData = new FormData()
    formData.append("is_superuser", index)
    console.log(formData)
    await apiInstance.patch(`admin/user/${id}`, formData,  {
      headers: {
          "Content-Type": "multipart/form-data",
      }
    })
  }

  const handleDeleteUser = async (id) => {
    console.log(id)

    try {
        // Confirm deletion with a window prompt
        const confirmed = window.confirm(
        "Are you sure you want to delete this user?"
        );
        if (confirmed) {
        // Reference to the document in Firestore
        await apiInstance.delete(`admin/user/${id}`)
        Swal.fire({
            icon: "success",
            title: "User has been deleted",
        }).then(function(){location.reload()});
        }
    } catch (error) {
        // Log any errors that occur during the deletion processs
        console.error("Error deleting document: ", error);
    } finally {
        // Set options visibility after deletion attempt
        setOptionsVisible(id);
        
    }
    };

  return (
    <table>
    <thead>
      <tr>
        <th>Id</th>
        <th>Username</th>
        <th>Full name</th>
        <th>Email</th>
        <th>Is admin</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {
        users
          ? users.map((user) => (
            <tr key={user.id}>
            <td>           
            { user.id }
            </td>
            <td>
            <a href={`/admin/files/${user.id}`}> 
            { user.username }
            </a> 
            </td>
            <td>{ user.full_name }</td>
            <td>{ user.email }</td>
            <td> 
            <MDBCheckbox defaultChecked={user.is_superuser} label="Has admin rights" 
            onChange={(e) => HandleChange(user.id, e.target.checked)} />
            </td>
            <td>
              <span className="btn-round mb-0 btn btn-danger" data-bs-toggle="tooltip" 
                  data-bs-placement="top"  title="Delete" onClick={() => handleDeleteUser(user.id)}>
                  Delete
              </span>
            </td>
            </tr>
          ))
          : null
      }
    </tbody>
  </table>
);
}



export default UsersList;