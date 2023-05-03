import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
export const Mycontext = createContext()

export const Allcontext = ({children}) => {
    const [openMenu , setMenu] = useState({
        menu: false,
        bell: false
    })
    const [hasLogin , sethasLogin] = useState(false)
    const user_data = Cookies.get('user');
    const user = user_data ? JSON.parse(user_data) : ''
    useEffect(()=> {
       
    } , [])
    
    return (
        <Mycontext.Provider value={{
            openMenu , setMenu,
            hasLogin , sethasLogin , user
        }}>
           {children}
        </Mycontext.Provider>
    )
}
