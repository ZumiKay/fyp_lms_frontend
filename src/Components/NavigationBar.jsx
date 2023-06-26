import React, { useContext, useEffect, useRef, useState } from 'react';
import '../Style/style.css';
import { Loading, setimage } from './Asset';
import Logo from '../Image/Logo.png';
import '../Style/style.css';
import { Link, useNavigate } from 'react-router-dom';
import { Mycontext } from '../Config/context';
import axios from 'axios';
import env from '../env';
import Cookies from 'js-cookie';
import { DeleteDialog, FormDialog, FullScreenDialog } from './Modal';

const NavigationBar = () => {
    const ctx = useContext(Mycontext);
    const [change, setchange] = useState(false);
    const [openmenu, setopenmenu] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();
    const handleClick = (e) => setopenmenu(true);
    const handleresize = () => {
        if (window.innerWidth > 800) {
            setchange(true);
        } else {
            setchange(false);
        }
    };
    const handleSearch = (e) => {
        ctx.setsearch(e.target.value);
    };
    useEffect(() => {
        if (window.innerWidth > 800) {
            setchange(true);
        } else {
            setchange(false);
        }
        const handleref = (e) => {
            if (ref.current && ref.current.contains(e.target)) {
                setopenmenu(true);
            }
        };
        window.addEventListener('mousedown', handleref);
        window.addEventListener('resize', handleresize);
        return () => {
            window.removeEventListener('mousedown', handleref);
            window.removeEventListener('resize', handleresize);
        };
    }, []);

    return change ? (
        <div className={'NavBar_container'}>
            <div className="first_sec">
                <img ref={ref} id="menu" style={ctx.openMenu.menu ? { opacity: '.5' } : {}} onClick={handleClick} src={setimage.Menu} alt="svg_img" className="menu_btn" />
                <img onClick={() => navigate('/')} src={Logo} alt="png_img" className="logo" />
                <MenuItem open={openmenu} setopen={setopenmenu} />
            </div>
            <div className="second_sec">
                <i className="fa-solid fa-magnifying-glass" id="search_icon"></i>
                <input className="search" onClick={() => navigate('/')} onChange={handleSearch} type="text" placeholder="Search by title,author,ISBN" />
            </div>

            <div className="third_sec">
                {ctx.user.user.role === 'librarian' ? (
                    <p className="library_status librarian_status">Librarian</p>
                ) : ctx.user.user.role === 'headdepartment' ? (
                    <p className="library_status">HD</p>
                ) : !(new Date().getHours() > 17) ? (
                    <p className="library_status"> Library is Open </p>
                ) : (
                    <p className="library_status" style={{ backgroundColor: 'red', color: 'white' }}>
                        {' '}
                        Library is Close{' '}
                    </p>
                )}

                {ctx.user.user.role === 'student' && (
                    <i onClick={() => navigate('/bucket')} className={ctx.added ? 'fa-solid fa-cart-shopping bellanimated' : 'fa-solid fa-cart-shopping'} id={'bell'}>
                        <span className={'cart-count'}>{ctx.bookcart.filter(({ userid }) => userid === ctx.user.user.ID).length}</span>
                    </i>
                )}
            </div>
            <DeleteDialog type={'password'} />
            <DeleteDialog type={'editlibrarian'} />
            <FormDialog type={'HD'} />
        </div>
    ) : (
        <div className={'NavBar_container'}>
            <div className="first_sec">
                <img ref={ref} id="menu" style={ctx.openMenu.menu ? { opacity: '.5' } : {}} onClick={handleClick} src={setimage.Menu} alt="svg_img" className="menu_btn" />
                <i onClick={() => ctx.setMenu({ ...ctx.openMenu, search: !ctx.openMenu.search })} className="fa-solid fa-magnifying-glass fa-2xl" id="search_icon"></i>
                {ctx.openMenu.search && <input className="resizeinput" onClick={() => navigate('/')} onChange={handleSearch} type="text" placeholder="Search by title,author,ISBN" />}
                <MenuItem open={openmenu} setopen={setopenmenu} />
            </div>
            <div className="second_sec">
                <img onClick={() => navigate('/')} style={{ width: '90px' }} src={Logo} alt="png_img" className="logo" />
            </div>

            <div className="third_sec">
                {ctx.user.user.role === 'librarian' ? (
                    <p className="library_status librarian_status">Librarian</p>
                ) : ctx.user.user.role === 'headdepartment' ? (
                    <p className="library_status">HD</p>
                ) : (
                    ''
                )}

                {ctx.user.user.role === 'student' && (
                    <i
                        onClick={() => navigate('/bucket')}
                        className={
                            ctx.openMenu[`book${ctx.bookcart.filter(({ userid }) => userid === ctx.user.user.ID).length}`] ? 'fa-solid fa-cart-shopping bellanimated' : 'fa-solid fa-cart-shopping'
                        }
                        id="bell"
                    >
                        <span className="cart-count">{ctx.bookcart.filter(({ userid }) => userid === ctx.user.user.ID).length}</span>
                    </i>
                )}
            </div>

            <DeleteDialog type={'password'} />
            <DeleteDialog type={'editlibrarian'} />
            {ctx.openMenu.HD && <FormDialog type={'HD'} />}
        </div>
    );
};
export default NavigationBar;

const MenuItem = (props) => {
    const ctx = useContext(Mycontext);
    const navigate = useNavigate();
    const userref = useRef(null);

    const user_data = ctx.user;
    const [openreport, setopenreport] = useState(false);
    const handleLogout = () => {
        ctx.setloading({ ...ctx.loading, logout: true });
        axios({
            method: 'post',
            url: env.api + 'logout',
            data: user_data.token.refreshToken
        }).then(() => {
            ctx.setloading({ ...ctx.loading, logout: true });
            Cookies.remove('user');
            window.location.reload();
        });
    };
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (userref.current && !userref.current.contains(event.target)) {
                props.setopen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [ctx]);
    return (
        <div ref={userref} className={props.open ? 'MenuItem Menu_Animated' : 'MenuItem'}>
            {ctx.loading.logout && <Loading />}
            <div className="profile_sec">
                <p onClick={() => navigate('/profile')} className="Account_Detail">
                    {user_data.user.role !== 'librarian' ? `${user_data.user.firstname + ' ' + user_data.user.lastname} (${user_data.user.ID})` : `${user_data.user?.fullname} (${user_data.user.ID})`}
                </p>
            </div>
            <div className="menu_sec">
                {user_data.user.role !== 'librarian' && (
                    <Link className="link_page" to={'/'}>
                        <i class="fa-solid fa-book"></i> BROWSE
                    </Link>
                )}
                {user_data.user.role === 'librarian' && (
                    <Link className="link_page" to={'/listborrowedbook'}>
                        <i class="fa-solid fa-receipt"></i> BORROWED BOOKS
                    </Link>
                )}
                {user_data.user.role === 'librarian' ? (
                    <Link className="link_page" to="/allbook">
                        <i class="fa-solid fa-book-bookmark"></i> LIST OF BOOKS{' '}
                    </Link>
                ) : (
                    ctx.user.user.role === 'student' && (
                        <Link to={'/borrowedbook'} className="link_page">
                            {' '}
                            <i class="fa-solid fa-book-bookmark"></i> BORROWED BOOKS
                        </Link>
                    )
                )}

                {user_data.user.role === 'librarian' && (
                    <>
                        <Link className="link_page" to={'/liststudent'}>
                            <i class="fa-solid fa-address-book"></i> STUDENT LIST
                        </Link>
                        <Link className="link_page" to={'/scan-entry'}>
                            <i class="fa-solid fa-qrcode"></i> SCAN ENTRY
                        </Link>
                        <Link className="link_page" to={'/scanp-r'}>
                            {' '}
                            <i class="fa-solid fa-qrcode"></i> SCAN PICKUP
                        </Link>
                        <Link onClick={() => setopenreport(true)} className="link_page">
                            <i class="fa-regular fa-calendar-check"></i> REPORT
                        </Link>

                        {/* <Link onClick={() => ctx.setMenu({...ctx.openMenu , HD: true})} className="link_page"><i class="fa-regular fa-calendar-check"></i> ADD HEADDEAPERMENT</Link> */}
                    </>
                )}
                {(user_data.user.role === 'librarian' || user_data.user.role === 'headdepartment') && (
                  
                        <Link className="link_page" to={'/summary-stu'}>
                            <i class="fa-solid fa-address-book"></i> SUMMARY STUDENTS
                        </Link>
                    
                )}
                {ctx.user.user.role !== 'librarian' && (
                    <Link className="link_page" onClick={() => ctx.setMenu({ ...ctx.openMenu, openchangepwd: true })}>
                        <i class="fa-solid fa-gear"></i> SETTING
                    </Link>
                )}
                {ctx.user.user.role === 'librarian' && (
                    <Link className="link_page" onClick={() => ctx.setMenu({ ...ctx.openMenu, editlibrarian: true })}>
                        <i class="fa-solid fa-gear"></i> SETTING{' '}
                    </Link>
                )}
                <p onClick={handleLogout}>Logout</p>
                <FullScreenDialog type="Create Report" open={openreport} setopen={setopenreport} />
            </div>
        </div>
    );
};
