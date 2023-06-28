import React, { useContext, useState } from 'react'
import '../../Style/style.css'
import { Loading } from '../Asset'
import axios from 'axios'
import env from '../../env'
import Cookie from 'js-cookie'
import toast from 'react-hot-toast';
import Logo from '../../Image/Logo.png'
import { Mycontext } from '../../Config/context'
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const [user_data , setuser] = useState({})
    const ctx = useContext(Mycontext)
    const navigate = useNavigate()
    const [loading , setloading] = useState(false)
    const [reset , setreset] = useState(false)
    const handleChange = (e) => {
      if (e.target.value.includes(' ')) {
        e.preventDefault();
      } else {
        setuser({...user_data, [e.target.id]: e.target.value.replace(/\s+/g, '')})
        
      }
     }
    
   
    const handleSubmit = async (e) => {
      e.preventDefault();
      setloading(true);
    
      try {
        const response = await axios.post(env.api + "login", user_data);
        setloading(false);
        ctx.sethasLogin(true);
        Cookie.set('user', JSON.stringify(response.data), { expires: 7 });
        navigate('/', { replace: true });
        
        
        window.location.reload();
      } catch (err) {
        setloading(false);
        const errorMessage = err.response?.data?.message || 'An error occurred';
        toast.error(errorMessage, {
          duration: 2000
        });
      }
    };
  const handleResetPWD  = (e) => {
    e.preventDefault()
    setloading(true)
    axios({
      method:"post" , 
      url : env.api + "resetstudent" ,
      data: user_data
    }).then((res) => {
      setloading(false)
      e.target.reset()
      toast.success(res.data.message , {duration: 2000})
    }).catch((err) => {
      setloading(false)
      toast.error(err.response?.data?.message , {duration:2000}) 
    })
  }
    
  return (
    <div className='Login_container'>
       {loading && <Loading/>}
        {!reset ? <form className="Login_form" onSubmit={handleSubmit}>
               
            <img src={Logo} alt='logo' className='logo'/>
            <input type={'text'} id="email" onChange={handleChange} placeholder='Email / ID Number' required/>
            <input type="password" onChange={handleChange} id="password" placeholder='Password' required/>
            <input type="submit" onChange={handleChange} value={'Login'} id="login-btn"/> 
            <p onClick={() => setreset(true)} className='forgot'>Forgot Password ?</p>
        </form>  : <form className="Login_form" onSubmit={handleResetPWD}>
        <img src={Logo} alt='logo' className='logo'/>
        <input type="text" id='email' onChange={handleChange} placeholder='Email or ID Number' required />
        <button className='login-btn' type='submit'>CONFIRM</button>
        <p onClick={() => setreset(false)} className='forgot'>Has an account ?</p>
          </form>}
        
    </div>
    
  )
}

export default Login