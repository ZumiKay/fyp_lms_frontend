import React, { useContext, useEffect, useState } from 'react'
import '../../Style/style.css'
import { Mycontext } from '../../Config/context';
const Profile = () => {
    const ctx = useContext(Mycontext)
    const [resize , setresize] = useState(false) 
    useEffect(() => {
        
        const handleresize = () => {
            if(window.innerWidth < 768) {
                setresize(true)
            } else {
                setresize(false)
            }
        }
        handleresize()
        window.addEventListener("resize" , handleresize)

        return () => window.removeEventListener('resize' , handleresize)
        
    } , [])
  return (
    
      <div className="profile_page">
          
          <h1>Account Informations</h1>
          {resize ?  <table className='profile_table'>
         
       
            {ctx.user.user.firstname &&
            <>
            <tr>
            <th>Firstname: </th>
             <td>{ctx.user.user.firstname}</td>
             </tr>
             <tr>
             <th>Lastname: </th>
             <td>{ctx.user.user.lastname}</td>
             </tr>
             </>
             }
             {!ctx.user.user.firstname && <>
             <tr>
             <th>Fullname: </th>
             <td>{ctx.user.user.fullname}</td>
             </tr>
             </>}
       
         <tr>
             <th>ID Card: </th>
             <td>{ctx.user.user.ID}</td>
        </tr>
        <tr>
             <th>Department: </th>
             <td>{ctx.user.user.department ? ctx.user.user.department : 'Library'}</td>
         </tr>
         <tr>
             <th>Phone Number</th>
             <td>{ctx.user.user.phonenumber}</td>
         </tr> <tr>    
             <th>Email</th>
             <td>{ctx.user.user.email}</td>
         </tr>
       </table> : 
          <table className='profile_table'>
         
            <tr>
               {ctx.user.user.firstname &&
               <>
               <th>Firstname: </th>
                <td>{ctx.user.user.firstname}</td>
                <th>Lastname: </th>
                <td>{ctx.user.user.lastname}</td>
                </>
                }
                {!ctx.user.user.firstname && <>
                <th>Fullname: </th>
                <td>{ctx.user.user.fullname}</td>
                </>}
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
}
      </div>
      
  );
}

export default Profile