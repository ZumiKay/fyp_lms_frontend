import React, { useContext, useEffect, useState } from 'react'
import '../../Style/style.css'
import DataTable from '../DataTable'
import axios from 'axios'
import env, { createBorrowedData } from '../../env'
import { Mycontext } from '../../Config/context'
import { Loading } from '../Asset'

const ListofBorrowedbook = () => {
  const ctx = useContext(Mycontext)
  const [borrowedbook , setborrowed] = useState([])

  
  const getborrowedbook = () => {
    ctx.setloading({...ctx.loading , borrowedbook:true})
    let bookdata
    axios({
        method: 'get',
        url: env.api + `getborrowedbook/${ctx.user.user.ID}`,
        headers: {
            Authorization: `Bearer ${ctx.user.token.accessToken}`
        }
    }).then(res => {
      
      bookdata = res.data.map((i) => {
       
        return createBorrowedData(i.borrow_id , i.Book.Books, i.Book.status , (i.Book.borrow_date),i.return_date,(i.Book.expect_return_date) , i.Book.qrcode)
    })
    setborrowed(bookdata)
    ctx.setloading({...ctx.loading , borrowedbook:false})
    })
    
    
    
    
    
    
    
  }
  useEffect(() => {
    getborrowedbook()
  } , [])
  return (
    <div className='borrowedbook_container'>
        <h1>List of Borrowed Book</h1>
        {ctx.loading.borrowedbook && <Loading/>}
        <div className="table_container">
            
            <DataTable type={"borrowedbook"} data={borrowedbook}/>
        </div>
    </div>
  )
}

export default ListofBorrowedbook