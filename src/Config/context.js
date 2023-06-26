import { createContext, useState } from "react";
import Cookies from "js-cookie";
export const Mycontext = createContext()

export const Allcontext = ({children}) => {
    const [openMenu , setMenu] = useState({
        menu: false,
        bell: false,
        openform: false,
        opendelete: false,
        openchangepwd: false ,
        openfullscreen: false ,
        search: false,
        HD: false
       
    })
    const [borrowedrequest , setborrowedrequest] = useState([])
    const [hasLogin , sethasLogin] = useState(false)
    const [filter_cat, setfilter_cat] = useState('')
    const user_data = Cookies.get('user');
    const user = user_data ? JSON.parse(user_data) : ''
    const [student , setstudent] = useState([])
    const [book, setbook] = useState({})
    const prevcart = localStorage.getItem('cart')
    const [bookcart, setcart] = useState(JSON.parse(prevcart) || [])
    const [search , setsearch] = useState('')
    const [loading , setloading] = useState(false)
    const [added, setadded] = useState(false)
    const [dep , setdep] = useState([])
    return (
        <Mycontext.Provider value={{
            openMenu , setMenu,
            hasLogin , sethasLogin , user ,
            filter_cat , setfilter_cat,
            student , setstudent ,
            book , setbook,
            bookcart , setcart,
            search , setsearch , 
            loading , setloading , 
            added , setadded , 
            dep , setdep , 
            borrowedrequest , setborrowedrequest
        }}>
           {children}
        </Mycontext.Provider>
    )
}

