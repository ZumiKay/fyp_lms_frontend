
//https://fyplms.as.r.appspot.com/api/

const env = {
    api: 'https://fyplms.as.r.appspot.com/api/',
    
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
    // Split the text into an array of words
    const words = text.toLowerCase().split(' ');
  
    // Capitalize the first letter of each word
    const pascalWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  
    // Join the words together without spaces
    const pascalCaseText = pascalWords.join('');
  
    return pascalCaseText;
  }  