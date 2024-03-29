
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
export const createBorrowedDatas = (borrowid, student, bookdetail , status,borrowdate,returndate, expectreturndate,qrcode) => {

    return {borrowid,student,bookdetail , status , borrowdate , returndate , expectreturndate  , qrcode}
  }   
  
export function convertToPascalCase(text) {
    
    const words = text.toLowerCase().split(' ');
  
    
    const pascalWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  
   
    const pascalCaseText = pascalWords.join('');
  
    return pascalCaseText;
  }  