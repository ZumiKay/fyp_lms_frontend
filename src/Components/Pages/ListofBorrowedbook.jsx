import React, { useContext, useEffect, useState } from 'react'
import '../../Style/style.css'
import DataTable from '../DataTable'
import axios from 'axios'
import env, { createBorrowedData } from '../../env'
import { Mycontext } from '../../Config/context'
const ListofBorrowedbook = () => {
  const ctx = useContext(Mycontext)
  const [borrowedbook , setborrowed] = useState([])

  
  const getborrowedbook = async () => {
    
    let bookdata
    const res = await axios({
        method: 'get',
        url: env.api + `getborrowedbook/${ctx.user.user.ID}`,
        headers: {
            Authorization: `Bearer ${ctx.user.token.accessToken}`
        }
    })
    bookdata = res.data.map((i) => {
       
        return createBorrowedData(i.borrow_id , i.Book.Books, i.Book.status , new Date(i.Book.borrow_date).toLocaleDateString(),i.Book.return_date,new Date(i.Book.expect_return_date).toLocaleDateString() , i.Book.qrcode)
    })
    setborrowed(bookdata)
    
    
    
    
  }
  useEffect(() => {
    getborrowedbook()
  } , [])
  return (
    <div className='borrowedbook_container'>
        <h1>List of Borrowed Book</h1>
        <div className="table_container">
            <DataTable type={"borrowedbook"} data={borrowedbook}/>
        </div>
    </div>
  )
}

export default ListofBorrowedbook