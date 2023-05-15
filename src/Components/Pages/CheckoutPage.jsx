import React, { useContext, useEffect, useState } from 'react';
import '../../Style/style.css';
import { Mycontext } from '../../Config/context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import env from '../../env';
import { toast } from 'react-hot-toast';
import { duration } from '@mui/material';
import { setimage } from '../Asset';
const CheckoutPage = () => {
    const ctx = useContext(Mycontext);
    const [borrowid, setid] = useState('');
    const [loading, setloading] = useState(false);
    const [checked, setchecked] = useState('');
    const navigate = useNavigate();
    const handleCheckout = async () => {
        setloading(true);
        const res = await axios({
            method: 'post',
            url: env.api + 'checkout',
            headers: {
                Authorization: `Bearer ${ctx.user.token.accessToken}`
            },

            data: {
                borrowbooks: ctx.bookcart,
                ID: ctx.user.user.ID,
                id: ctx.user.user.id
            }
        })
            .then((res) => {
                toast.success('Checkout Complete', { duration: 2000 });
                setloading(false);
                setchecked(res.data);

                localStorage.removeItem('cart');
                ctx.setcart([]);
            })
            .catch(() => toast.error('Something Wrong', { duration: 2000 }));
        console.log(res.data);
    };
    const handleCancel = () => {
        localStorage.removeItem('cart');
        ctx.setcart([]);
    };
    const handledelete = (passtitle) => {
        let filtercart = ctx.bookcart.filter(({ title }) => title !== passtitle);
        ctx.setcart(filtercart);
        localStorage.setItem('cart', JSON.stringify(filtercart));
    };
    useEffect(() => {
        function handleBeforeUnload(e) {
            e.preventDefault();
            e.returnValue = '';
        }
        if (checked !== '') {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }
        
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [checked]);
    return (
        <div className="checkout_container">
            <h1>BOOK BACKET</h1>

            <div className="book_container">
                {checked === '' ? (
                    ctx.bookcart
                        ?.filter(({ userid }) => userid === ctx.user.user.ID)
                        .map((book) => (
                            <div className="book">
                                <img onClick={() => navigate(`/book/${book.title}`)} src={book.cover_img} alt="cover" className="book_cover" />
                                <div className="book_detail">
                                    <p>{book.title}</p>
                                    <p>ISBN: {book.ISBN[0].identifier}</p>
                                    <p>{book.categories}</p>
                                </div>
                                <i onClick={() => handledelete(book.title)} className="fa-solid fa-trash trash"></i>
                            </div>
                        ))
                ) : (
                    <div className="checked_container">
                        <h1 style={{ color: 'green' }}>CHECKOUT COMPLETE</h1>
                        <h1>BORROWID: {checked.borrow_id} </h1>
                        <p style={{ color: 'red' }}>Please take screenshot of the this section for pickup</p>
                        <p style={{ color: 'red' }}>QR Code will expire in 24h</p>
                        <img className="qrcode" src={checked.qrcode} alt="" srcset="" />
                    </div>
                )}
            </div>
            {checked === '' && (
                <div className="btn_sec">
                    {ctx.bookcart.length > 0 ? (
                        <>
                            {' '}
                            <button onClick={handleCancel} className="btn">
                                CANCEL
                            </button>
                            <button onClick={handleCheckout} className="btn">
                                CHECKOUT
                            </button>{' '}
                        </>
                        
                    ) : <h1 style={{color:"red"}}>Cart is empty</h1>}
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
