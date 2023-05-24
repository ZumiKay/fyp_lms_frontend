import React, { useContext } from 'react'
import '../../Style/style.css'
import { Mycontext } from '../../Config/context';
const Profile = () => {
    const ctx = useContext(Mycontext)
  return (
    
      <div className="profile_page">
          <h1>Account Informations</h1>
          
          <table className='profile_table'>
            <tr>
                <th>Firstname: </th>
                <td>{ctx.user.user.firstname ? ctx.user.user.firstname : ctx.user.user.fullname.split(' ')[0]}</td>
                <th>Lastname: </th>
                <td>{ctx.user.user.lastname ? ctx.user.user.lastname : ctx.user.user.fullname.split(' ')[1]}</td>
            </tr>
            <tr>
                <th>ID Card: </th>
                <td>{ctx.user.user.ID}</td>

                <th>Department: </th>
                <td>{ctx.user.user.department ? ctx.user.user.department : 'Library'}</td>
            </tr>
            <tr>
                <th>Phone Number</th>
                <td>{ctx.user.user.phonenumber}</td>
                <th>Email</th>
                <td>{ctx.user.user.email}</td>
            </tr>
          </table>
          
      </div>
      
  );
}

export default Profile