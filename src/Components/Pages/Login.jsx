import React, { useContext, useState } from 'react'
import '../../Style/style.css'
import { Loading, setimage } from '../Asset'
import axios from 'axios'
import env from '../../env'
import Cookie from 'js-cookie'
import toast from 'react-hot-toast';
import { Mycontext } from '../../Config/context'
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const [user_data , setuser] = useState({})
    const ctx = useContext(Mycontext)
    const navigate = useNavigate()
    const [loading , setloading] = useState(false)
    const handleChange = (e) => {
      setuser({...user_data, [e.target.id]: e.target.value})
    }
    
   
    const handleSumbit = (e) => {
        e.preventDefault()
        setloading(true)
        axios({
          method:"post",
          url: env.api + "login",
          data: user_data
        }).then(res => {
          setloading(false)
          ctx.sethasLogin(true)
          Cookie.set('user', JSON.stringify(res.data) , {expires: 7})
          navigate('/' ,{replace: true})
          window.location.reload()
        }).catch(err => {
        setloading(false)
         toast.error(err.response.data.message , {
          duration: 2000
         })
          

        })
    }
  return (
    <div className='Login_container'>
        <form className="Login_form" onSubmit={handleSumbit}>
            {loading && <Loading/>}    
    
            <img src={setimage.Logo} alt='logo' className='logo'/>
            <input type={'text'} id="email" onChange={handleChange} placeholder='Email / ID Number' required/>
            <input type="password" onChange={handleChange} id="password" placeholder='Password' required/>
            <input type="submit" onChange={handleChange} value={'Login'} id="login-btn"/> 
         
        </form> 
    </div>
    
  )
}

export default Login