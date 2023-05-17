import React , {useContext, useEffect, useState} from 'react'
import '../../Style/style.css'
import {QrScanner} from '@yudiel/react-qr-scanner';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import env from '../../env';
import { Mycontext } from '../../Config/context';
import { Loading } from '../Asset';
import ResponsiveDialog from '../Modal';



const ScanStudentEntry = (props) => {
  const ctx = useContext(Mycontext)
  const [scanned , setscan] = useState(false)
  const [studentdata , setdata] = useState({})
  const [open , setopen] = useState(false)
  const onNewScanResult = async (data) => {
    setscan(true)
    
    if(data) { 
      
      if(props.type === 'scanentry') {
       axios({
        method:'post' ,
        url: env.api + "s-entry",
        headers: {
          Authorization: `Bearer ${ctx.user.token.accessToken}`
        },
        data: {url : data}
      }).then((res) => {
        setdata(res.data)
        setopen(true)
        document.body.style.backgroundColor = 'white'
       
      }).catch(err => {
        setscan(false)
        toast.error("Please Register The Student First" , {duration: 2000})

      })
    } 
    else {
      axios({
        method: "post",
        url: env.api + "r-pb",
        headers: {
          Authorization: `Bearer ${ctx.user.token.accessToken}`
        },
        data : {
          borrow_id : data,
          operation: 'pickup',
     }}).then(res => {
        setdata(res.data)
        setopen(true)
        document.body.style.backgroundColor = 'white'
     }).catch(err => {
      setscan(false)
      toast.error("Error Qr Code" , {duration: 2000})

    })
      
    }
  
  }
    
    
  }
  const handleError = (err) => {
   
   
  }
  
  return (
    <div className='scanentry_container'>
      
      <div className="scan_instruction">
      {props.type !== 'scanp-r' ? 
      <>
       <h1>Scan Student Entry</h1>
       <h2>{scanned ? 'Student ID Scanned' : "Place StudentID QR In The Red Box"}</h2>
      </> : 
      <>
      <h1>Scan Pickup QR CODE</h1>
      <h2>{scanned ? 'QR CODE Scanned' : "Place The Pickup QR CODE In The Red Box"}</h2>
      </>
      
     }
       
        
      </div>
      <div className="qrcode_reader">
     {scanned ? <Loading/> :
      <QrScanner onDecode={onNewScanResult} onError={handleError}/>}
      </div>
      <ResponsiveDialog open={open} type={props.type} data={studentdata} setscan={setscan} setopen={setopen}/>
     

    </div>
  )
}

export default ScanStudentEntry

