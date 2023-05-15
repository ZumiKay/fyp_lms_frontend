import React, { useContext, useEffect, useState } from 'react';
import '../Style/style.css';
import { setimage } from './Asset';
import '../Style/style.css';
import { Link, useNavigate } from 'react-router-dom';
import { Mycontext } from '../Config/context';
import axios from 'axios';
import env from '../env';
import Cookies from 'js-cookie';
import { DeleteDialog } from './Modal';

const NavigationBar = () => {
    const ctx = useContext(Mycontext);
    const [change, setchange] = useState(false);
    const navigate = useNavigate()
    const handleClick = (e) => ctx.setMenu({ ...ctx.openMenu, [e.target.id]: !ctx.openMenu[e.target.id] });
    const handleresize = () => {
        if (window.innerHeight < 850) {
            setchange(true);
        }
    };
    const handleSearch = (e) => {
        ctx.setsearch(e.target.value)
    }
    useEffect(() => {
        window.addEventListener('resize', handleresize);
    }, [change]);
    return (
        <div className={'NavBar_container'}>
            <div className="first_sec">
                <img id="menu" style={ctx.openMenu.menu ? { opacity: '.5' } : {}} onClick={handleClick} src={setimage.Menu} alt="svg_img" className="menu_btn" />
                <img src={setimage.Logo} alt="png_img" className="logo" />
                <MenuItem />
            </div>
            <div className="second_sec">
                <i className="fa-solid fa-magnifying-glass" id="search_icon"></i>
                <input className="search" onChange={handleSearch} type="text" placeholder="Search by title,author,ISBN" />
            </div>

            <div className="third_sec">
                {ctx.user.user.role === 'librarian' ? <p className="library_status librarian_status">Librarian</p> : <p className="library_status">Library is Open</p>}
                
                <i onClick={() => navigate('/bucket')} className={ctx.openMenu[`book${ctx.bookcart.filter(({userid}) => userid === ctx.user.user.ID).length}`] ? "fa-solid fa-cart-shopping bellanimated" : "fa-solid fa-cart-shopping"} id='bell'>
                    <span className='cart-count'>{ctx.bookcart.filter(({userid}) => userid === ctx.user.user.ID).length}</span>
                </i>
                
                {ctx.openMenu.bell && <NotificationMenu />}
            </div>
            <DeleteDialog type={"password"}/>
        </div>
    );
};
export default NavigationBar;

const MenuItem = () => {
    const ctx = useContext(Mycontext);
    const user_data = ctx.user;
    const handleLogout = () => {
        axios({
            method: 'post',
            url: env.api + 'logout',
            data: user_data.token.refreshToken
        }).then(() => {
            Cookies.remove('user');
            window.location.reload();
        });
    };
    return (
        <div className={ctx.openMenu.menu ? 'MenuItem Menu_Animated' : 'MenuItem'}>
            <div className="profile_sec">
                <img src={'https://firebasestorage.googleapis.com/v0/b/fyp-9ae4d.appspot.com/o/Fraud.jpg?alt=media&token=8faabaa7-44fa-4461-9e9d-a8fb748dffd8'} alt="" className="profile_img" />
                <p className="Account_Detail">
                    {user_data.user.role !== 'librarian' ? `${user_data.user.firstname + " " + user_data.user.lastname} (${user_data.user.ID})` : 
                    `${user_data.user?.fullname} (${user_data.user.ID})`}
                </p>
            </div>
            <div className="menu_sec">
                <Link className="link_page" to={'/'}>
                <i class="fa-solid fa-book"></i>
                {" "}
                Browse Book
                </Link>
                {user_data.user.role === 'librarian' && <Link className="link_page" to={'/listborrowedbook'}>BorrowedBook List</Link>}
               {user_data.user.role === 'librarian' ? <Link className='link_page' to="/allbook"><i class="fa-solid fa-book-bookmark"></i> List of All Book </Link> : <Link to={'/borrowedbook'} className="link_page"> <i class="fa-solid fa-book-bookmark"></i> List of Borrowed Book</Link>}
               {user_data.user.role === 'librarian' && (
                    <>
                        <Link className="link_page" to={'/liststudent'}><i class="fa-solid fa-address-book"></i> {" "}List of Student</Link>
                        <Link className="link_page" to={'/scan-entry'}>Scan Student Entry</Link>
                        <Link className="link_page" to={'/scanp-r'}>Scan Pickup QR Code</Link>
                        <Link className="link_page">Generate Report</Link>
                    </>
                )}
                {ctx.user.user.role !== 'librarian' && <Link className="link_page" onClick={() => ctx.setMenu({...ctx.openMenu , openchangepwd: true})}><i class="fa-solid fa-gear"></i> Change Password</Link>}
                <p onClick={handleLogout}>Logout</p>
            </div>
        </div>
    );
};

const NotificationMenu = () => {
    return (
        <div className="Notification_container">
            <h2>Notification</h2>

            <div className="notification_content">
                <h4 className="title">Created Title</h4>
                <p className="time"> 23m </p>
            </div>
            <div className="notification_content">
                <h4 className="title">Created Title</h4>
                <p className="time"> 23m </p>
            </div>
            <div className="notification_content">
                <h4 className="title">Created Title</h4>
                <p className="time"> 23m </p>
            </div>
            <div className="notification_content">
                <h4 className="title">Created Title</h4>
                <p className="time"> 23m </p>
            </div>
            <div className="notification_content">
                <h4 className="title">fdsfsdfdsfdsfdsfdfdsfdsfdsfdsfdsfdsfsfssfdsfdsfdsfdsfdsfdsfdsfsdf</h4>
                <p className="time"> 23m </p>
            </div>
        </div>
    );
};


