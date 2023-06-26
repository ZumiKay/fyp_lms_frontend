import React, { useContext, useEffect, useState } from 'react';
import '../../Style/style.css';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { Mycontext } from '../../Config/context';
const BookDetailPage = ({ book }) => {
    const ctx = useContext(Mycontext);
    const { title } = useParams();
    const [fitlerbook, setbook] = useState('');
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        let filterbook = book?.allbooks?.filter((i) => i.title === title);
        setbook(filterbook);
        ctx.setadded(false)
    }, [book]);

    const handleAddCart = () => {
        const prevcart = localStorage.getItem('cart');
        fitlerbook[0].userid = ctx.user.user.ID
        ctx.setadded(true)
        let storecart = [];
        if (prevcart) {
            let cart = JSON.parse(prevcart);
            storecart = [...cart, fitlerbook[0]];
           
        } else storecart = fitlerbook;
        fitlerbook[0].status = "unavailable"
        localStorage.setItem('cart', JSON.stringify(storecart));
        ctx.setcart((prev) => [...prev, fitlerbook[0]]);
    };

    return (
        <div className="bookdetail_contianer">
            <div className="firstsec">
                <img className="book_cover" src={fitlerbook && fitlerbook[0]?.cover_img} alt="cover" />
                <div className="detail">
                    <table className="content_table">
                        <tr>
                            <th>Title</th>
                            <td>{fitlerbook && fitlerbook[0]?.title}</td>
                        </tr>
                        <tr>
                            <th>Author</th>
                            <td>{fitlerbook && fitlerbook[0]?.author}</td>
                        </tr>
                        <tr>
                            <th>Categories</th>
                            <td>{fitlerbook && fitlerbook[0]?.categories}</td>
                        </tr>
                        <tr>
                            <th>ISBN</th>
                            <td>{fitlerbook && fitlerbook[0]?.ISBN[0].identifier}</td>
                        </tr>
                        <tr>
                            <th>PublisherDate</th>
                            <td>{fitlerbook && `${new Date(fitlerbook[0]?.publisher_date).toLocaleDateString('en')}`}</td>
                        </tr>
                        <tr style={{height: '100px'}}>
                            <th>Description</th>
                            <td style={{height: '100px'}}>{fitlerbook && fitlerbook[0]?.description}</td>
                        </tr>
                        <tr>
                            <th></th>
                            <td>
                       
                

                            </td>
                        </tr>
                    </table>
                   
                </div>
               
            </div>
            {(!ctx.bookcart.find(({ title }) => title === (fitlerbook && fitlerbook[0]?.title)) && (fitlerbook && fitlerbook[0]?.status !== 'unavailable')) ? (
                   ctx.user.user.role !== 'student' ?  
                   <Button className="borrow-btn" style={{backgroundColor:"green"}}>
                        available
                    </Button> :  
                    <Button onClick={handleAddCart} className="borrow-btn" endIcon={<i class="fa-solid fa-plus"></i>}>
                        Borrow
                    </Button> 
                ) : (
                    <Button className="borrow-btn brrowed">Unavaliable</Button>
                )}
        
        </div>
    );
};

export default BookDetailPage;
