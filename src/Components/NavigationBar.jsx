import React, { useContext, useEffect, useRef, useState } from 'react';
import '../Style/style.css';
import { Loading } from './Asset';
import Logo from '../Image/Logo.png';
import '../Style/style.css';
import { Link, useNavigate } from 'react-router-dom';
import { Mycontext } from '../Config/context';
import axios from 'axios';
import env from '../env';
import Cookies from 'js-cookie';
import { DeleteDialog, FormDialog, FullScreenDialog } from './Modal';
import menuimg from '../Image/menu_icon.png'

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
    const handleLogout = () => {
        ctx.setloading({ ...ctx.loading, logout: true });
        axios({
            method: 'post',
            url: env.api + 'logout',
            data: ctx.user.token.refreshToken
        }).then(() => {
            ctx.setloading({ ...ctx.loading, logout: true });
            Cookies.remove('user');
            window.location.reload();
        });
    };

    return change ? (
        <>
       
        <div className={'NavBar_container'}>
            
            <div className="first_sec">
                <img ref={ref} id="menu" style={openmenu ? {  backgroundColor: "#e2e2e2" } : {}} onClick={handleClick} src={menuimg} alt="svg_img" className="menu_btn" />
                <img onClick={() => navigate('/')} src={Logo} alt="png_img" className="logo" />
                
            </div>
            <div className="second_sec">
                <i className="fa-solid fa-magnifying-glass" id="search_icon"></i>
                <input className="search" onClick={() => navigate('/')} onChange={handleSearch} type="text" placeholder="Search by title,author,ISBN" />
            </div>

            <div className="third_sec">
                
            {ctx.user.user.role === 'student' && (
                    <i onClick={() => navigate('/bucket')} className={ctx.added ? 'fa-solid fa-cart-shopping bellanimated' : 'fa-solid fa-cart-shopping'} id={'bell'}>
                        <span className={'cart-count'}>{ctx.bookcart.filter(({ userid }) => userid === ctx.user.user.ID).length}</span>
                    </i>
                )}
                    <div className="profile_sec">
                    <p onClick={() => navigate('/profile')} className="Account_Detail">
                        {ctx.user.user.role !== 'librarian' ? `${ctx.user.user.firstname + ' ' + ctx.user.user.lastname}` : `${ctx.user.user?.fullname}`}
                    </p>
                </div>

                
                
                {ctx.user.user.role !== 'librarian' && (
                    <Link className="link_page" onClick={() => ctx.setMenu({ ...ctx.openMenu, openchangepwd: true })}>
                        <i class="fa-solid fa-gear fa-xl"></i>
                    </Link>
                )}
                {ctx.user.user.role === 'librarian' && (
                    <Link className="link_page" onClick={() => ctx.setMenu({ ...ctx.openMenu, editlibrarian: true })}>
                        <i class="fa-solid fa-gear fa-xl"></i>
                    </Link>
                )}
                <p className='logout' onClick={handleLogout}>SIGNOUT</p>
            </div>
            
            <DeleteDialog type={'password'} />
            <DeleteDialog type={'editlibrarian'} />
            <FormDialog type={'HD'} />
            <MenuItem open={openmenu} setopen={setopenmenu} />
        </div>
       
        </>
    ) : (
        <div className={'NavBar_container'}>
            <div className="first_sec">
                <img ref={ref} id="menu" style={ctx.openMenu.menu ? { opacity: '.5' } : {}} onClick={() => {
                    setopenmenu(true)
                    ctx.setMenu({...ctx.openMenu , menu: !ctx.openMenu.menu})
                }} src={menuimg} alt="svg_img" className="menu_btn" />
                <i onClick={() => ctx.setMenu({ ...ctx.openMenu, search: !ctx.openMenu.search })} className="fa-solid fa-magnifying-glass fa-2xl" id="search_icon"></i>
                {ctx.openMenu.search && <input className="resizeinput" onClick={() => navigate('/')} onChange={handleSearch} type="text" placeholder="Search by title,author,ISBN" />}
                <MenuItemformobile open={openmenu} otheropen={ctx.openMenu.menu} setopen={setopenmenu} />
            </div>
            <div className="second_sec">
                <img onClick={() => navigate('/')} style={{ width: '90px' }} src={Logo} alt="png_img" className="logo" />
            </div>

            <div className="third_sec">
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
            <div className="profile_sec">
                    <p onClick={() => navigate('/profile')} className="Account_Detail">
                        {ctx.user.user.role !== 'librarian' ? `${ctx.user.user.firstname + ' ' + ctx.user.user.lastname}` : `${ctx.user.user?.fullname}`}
                    </p>
                </div>

               
                
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
    const userref = useRef(null);

    const user_data = ctx.user;
    const [openreport, setopenreport] = useState(false);
    
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
            <div className="menu_sec">
                {user_data.user.role !== 'librarian' && (
                    <Link className="link_page" to={'/'}>
                        <i class="fa-solid fa-book fa-xl"></i> BROWSE
                    </Link>
                )}
                {user_data.user.role === 'librarian' && (
                    <Link className="link_page" to={'/listborrowedbook'}>
                        <i class="fa-solid fa-receipt fa-xl"></i> BORROWED BOOKS
                    </Link>
                )}
                {user_data.user.role === 'librarian' ? (
                    <Link className="link_page" to="/allbook">
                        <i class="fa-solid fa-book-bookmark fa-xl"></i> LIST OF BOOKS{' '}
                    </Link>
                ) : (
                    ctx.user.user.role === 'student' && (
                        <Link to={'/borrowedbook'} className="link_page">
                            {' '}
                            <i class="fa-solid fa-book-bookmark fa-xl"></i> BORROWED BOOKS
                        </Link>
                    )
                )}

                {user_data.user.role === 'librarian' && (
                    <>
                        <Link className="link_page" to={'/liststudent'}>
                            <i class="fa-solid fa-address-book fa-xl"></i> STUDENT LIST
                        </Link>
                        <Link className="link_page" to={'/scan-entry'}>
                            <i class="fa-solid fa-qrcode fa-xl"></i> SCAN ENTRY
                        </Link>
                        <Link className="link_page" to={'/scanp-r'}>
                            {' '}
                            <i class="fa-solid fa-qrcode fa-xl"></i> SCAN PICKUP
                        </Link>
                        <Link onClick={() => setopenreport(true)} className="link_page">
                            <i class="fa-regular fa-calendar-check fa-xl"></i> REPORT
                        </Link>

                        {/* <Link onClick={() => ctx.setMenu({...ctx.openMenu , HD: true})} className="link_page"><i class="fa-regular fa-calendar-check"></i> ADD HEADDEAPERMENT</Link> */}
                    </>
                )}
                {(user_data.user.role === 'librarian' || user_data.user.role === 'headdepartment') && (
                  
                        <Link className="link_page" to={'/summary-stu'}>
                            <i class="fa-solid fa-address-book fa-xl"></i> <span>SUMMARY STUDENTS</span> 
                        </Link>
                    
                )}
               
                
                <FullScreenDialog type="Create Report" open={openreport} setopen={setopenreport} />
            </div>
        </div>
    );
};

const MenuItemformobile = (props) => {
    const ctx = useContext(Mycontext);
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
        <div ref={userref} className={(props.open) ? 'MenuItem Menu_Animated' : 'MenuItem'}>
            {ctx.loading.logout && <Loading />}
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
                <p className='logout' onClick={handleLogout}>SIGNOUT</p>
                <FullScreenDialog type="Create Report" open={openreport} setopen={setopenreport} />
            </div>
        </div>
    );
};
