import React, { useContext, useEffect, useState } from 'react';
import '../Style/style.css';
import { setimage } from './Asset';
import '../Style/style.css';
import { Link } from 'react-router-dom';
import { Mycontext } from '../Config/context';
import axios from 'axios';
import env from '../env';
import Cookies from 'js-cookie';

const NavigationBar = () => {
    const ctx = useContext(Mycontext);
    const [change, setchange] = useState(false);
    const handleClick = (e) => ctx.setMenu({ ...ctx.openMenu, [e.target.id]: !ctx.openMenu[e.target.id] });
    const handleresize = () => {
        if (window.innerHeight < 850) {
            setchange(true);
        }
    };
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
                <input className="search" type="text" placeholder="Search by title,author,publishdate,ISBN" />
            </div>

            <div className="third_sec">
                {ctx.user.user.role === 'librarian' ? <p className="library_status librarian_status">Librarian</p> : <p className="library_status">Library is Open</p>}
                <i className="fa-regular fa-bell" id="bell" style={ctx.openMenu.bell ? { color: 'gray' } : {}} onClick={handleClick}></i>
                {ctx.openMenu.bell && <NotificationMenu />}
            </div>
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
                    {user_data.user.fullname} ({user_data.user.ID})
                </p>
            </div>
            <div className="menu_sec">
                <Link className="link_page" to={'/'}>
                    Browse Book
                </Link>
                <Link className="link_page">List of Borrowed Book</Link>
                <Link className="link_page">Book to Pick up</Link>
                {user_data.user.role === 'librarian' && (
                    <>
                        <Link className="link_page">List of Student</Link>
                        <Link className="link_page">Scan Student Entry</Link>
                        <Link className="link_page">Scan Pickup QR Code</Link>
                        <Link className="link_page">Generate Report</Link>
                    </>
                )}

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


