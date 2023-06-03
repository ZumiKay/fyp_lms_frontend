
//https://fyplms.as.r.appspot.com/api/

const env = {
    api: 'http://localhost:4000/api/',
    
}
export default env;



export function createData(studentID, fullname, department, email, phoneNumber , libraryentry , borrowedbook) {
    return { studentID, fullname ,department, phoneNumber, email ,libraryentry , borrowedbook};
}

export function createBookData (bookcover,title,ISBN, cateogories, status) {
    return {
        bookcover , title , ISBN , cateogories , status
    }
}


export  const createBorrowedData = (borrowid, bookdetail , status,borrowdate,returndate, expectreturndate,qrcode) => {

    return {borrowid,bookdetail , status , borrowdate , returndate , expectreturndate  , qrcode}
  }
  