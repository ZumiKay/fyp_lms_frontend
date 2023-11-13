import React, { useContext, useEffect, useState } from 'react'
import '../../Style/style.css'
import DataTable from '../DataTable'
import { Mycontext } from '../../Config/context'
import axios from 'axios'
import env from '../../env'
import { Loading } from '../Asset'

const ListofBook = () => {
    const ctx = useContext(Mycontext)

  return (
    <div className='booklist_container'>
        <div className="header_sec">
            <h1 className='titlepage font-black border-b-4 border-[#4682B4] p-2'>List of All Book</h1>
        </div>
        {ctx.loading.booklist && <Loading/>}
        <div className="table_sec">
         
            <DataTable type={"booklist"} data={ctx.book?.allbooks}/>
        </div>

    </div>
  )
}

export default ListofBook

export const BorrowedBook = () => {
  const ctx = useContext(Mycontext)
  const [borrowedbook , setborrowedbook] = useState([])
  const createBorrowedData = (borrowid, student, bookdetail , status,borrowdate,returndate, expectreturndate,qrcode) => {

    return {borrowid,student,bookdetail , status , borrowdate , returndate , expectreturndate  , qrcode}
  }   

  const getborrow = () => {
    ctx.setloading({...ctx.loading , borrowedbook: true})
    axios({
      method: "get",
      url: env.api + "getborrow_book",
      headers: {
        Authorization: `Bearer ${ctx.user.token.accessToken}`
    } 
    }).then(res => {
      const data = res.data
      let borrowbook = []
      data?.map(i => borrowbook.push(createBorrowedData(i.borrow_id, i.student , i.Books, i.status, i.borrow_date, i.return_date,i.expect_return_date, i.qrcode)))
      setborrowedbook(borrowbook)
      ctx.setloading({...ctx.loading , borrowedbook: false})
    })
  }
  useEffect(() => {
   
    getborrow()
  } , [])
  useEffect(() => {
    setborrowedbook(ctx.borrowedrequest)
  
  } , [ctx.borrowedrequest])

  return (
    <div className='borrowedbook_container'>
    <h1 className='titlepage font-black border-b-4 border-[#4682B4] p-2'>List of Borrowed Book</h1>
    {ctx.loading.borrowedbook && <Loading/>}
    <div className="table_container">
     <DataTable type={"borrowedbook"} data={borrowedbook}/>
    </div>
</div>
  )
}