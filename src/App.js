import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Pages/Home';
import NavigationBar from './Components/NavigationBar';
import { useContext, useEffect, useState } from 'react';
import Login from './Components/Pages/Login';
import { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Mycontext } from './Config/context';
import PrivateRoute, { LibrarianRoute, LibrarianandHD, LoginRoute } from './Config/PrivateRoute';
import BookDetailPage from './Components/Pages/BookDetail_page';
import axios from 'axios';
import env from './env';
import ScanStudentEntry from './Components/Pages/ScanStudentEntry';
import ListofStudentPage from './Components/Pages/ListofStudentPage';
import ListofBook, { BorrowedBook } from './Components/Pages/ListofBook';
import CheckoutPage from './Components/Pages/CheckoutPage';
import ListofBorrowedbook from './Components/Pages/ListofBorrowedbook';
import Profile from './Components/Pages/Profile';
import SummaryStudentInfopage from './Components/Pages/SummaryStudentInfo_page';


function App() {
    const ctx = useContext(Mycontext);
    const [haslogin, sethaslogin] = useState(false);
    const user = Cookies.get('user');
   
    const getbook = async () => {
        ctx.setloading({...ctx.loading, booklist: true})
        const res = await axios({
            method: 'get',
            url: env.api + 'getbook',
            headers: {
                Authorization: `Bearer ${ctx.user.token.accessToken}`
            }
        });
        const books = res.data;
        if(res.data) {
            ctx.setloading({...ctx.loading, booklist: false})
        }
        let allcategories = books.allcategories.filter((arr, index) => {
            return (
                index ===
                books.allcategories.findIndex((inner) => {
                    return inner.toString().toLowerCase() === arr.toString().toLowerCase();
                })
            );
        });
        let filteredbook = books.books.filter((obj, index, self) => index === self.findIndex((o) => o.title === obj.title)) 
        ctx.setbook({
            allcategories: allcategories ,
            allbooks: filteredbook
        })
    };
    const getDepartment = () => {
        axios({
            method: 'get',
            url: env.api + 'getdepartment',
            headers: {
                Authorization: `Bearer ${ctx.user.token.accessToken}`
            }
        }).then((res) => ctx.setdep(res.data));
    };
    useEffect(() => {
        if(user) {
            sethaslogin(true)
            getDepartment()
            getbook();
        } else {
            sethaslogin(false)
        }
       
        
        
    }, [user]);
    return (
        <div className="App">
            {user && <NavigationBar />}
            <Toaster />

            <Routes>
                {!haslogin && (
                    <Route
                        path="/login"
                        element={
                            <LoginRoute isSignedin={user}>
                                <Login />
                            </LoginRoute>
                        }
                    />
                )}

                <Route
                    path="/"
                    element={
                        <PrivateRoute isSignedin={user}>
                            {' '}
                            <Home book_data={ctx.book} />{' '}
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/book/:title"
                    element={
                        <PrivateRoute isSignedin={user}>
                            <BookDetailPage book={ctx.book} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/scan-entry"
                    element={
                        <LibrarianRoute isSignedin={user} isLibrarian={ctx.user.user?.role === 'librarian'}>
                            <ScanStudentEntry type="scanentry" />
                        </LibrarianRoute>
                    }
                />
                 <Route
                    path="/scanp-r"
                    element={
                        <LibrarianRoute isSignedin={user} isLibrarian={ctx.user.user?.role === 'librarian'}>
                            <ScanStudentEntry type="scanp-r" />
                        </LibrarianRoute>
                    }
                />
                <Route
                    path="/liststudent"
                    element={
                        <LibrarianandHD isSignedin={user} isHD={ctx.user.user?.role === 'headdepartment'} isLibrarian={ctx.user.user?.role === 'librarian'}>
                            <ListofStudentPage/>
                        </LibrarianandHD>
                    }
                />
                 <Route
                    path="/summary-stu"
                    element={
                        <LibrarianandHD isSignedin={user} isHD={ctx.user.user?.role === 'headdepartment'} isLibrarian={ctx.user.user?.role === 'librarian'}>
                           <SummaryStudentInfopage/>
                        </LibrarianandHD>
                    }
                />
                <Route
                path="/allbook"
                element= {
                    <LibrarianRoute isSignedin={user} isLibrarian={ctx.user.user?.role === 'librarian'}>
                        <ListofBook/>
                    </LibrarianRoute>
                }
                />
                <Route
                path="/listborrowedbook"
                element= {
                    <LibrarianRoute isSignedin={user} isLibrarian={ctx.user.user?.role === 'librarian'}>
                       <BorrowedBook/>
                    </LibrarianRoute>
                }
                />
                <Route
                path='/bucket'
                element = {
                    <PrivateRoute isSignedin={user}>
                        <CheckoutPage/>
                    </PrivateRoute>
                }
                />
                <Route
                path='/borrowedbook'
                element = {
                    <PrivateRoute isSignedin={user}>
                        <ListofBorrowedbook/>
                    </PrivateRoute>
                }
                />
                <Route
                path='/profile'
                element = {
                    <PrivateRoute isSignedin={user}>
                        <Profile/>
                    </PrivateRoute>
                }
                />
           
            </Routes>
            

        </div>
    );
}

export default App;
