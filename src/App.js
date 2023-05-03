import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Pages/Home';
import NavigationBar from './Components/NavigationBar';
import { useContext, useEffect, useState } from 'react';
import Login from './Components/Pages/Login';
import { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Mycontext } from './Config/context';
import PrivateRoute, { LoginRoute } from './Config/PrivateRoute';
import BookDetailPage from './Components/Pages/BookDetail_page';
function App() {
    const ctx = useContext(Mycontext);
    const [haslogin, sethaslogin] = useState(false);
    const user = Cookies.get('user')
    
    useEffect(() => 
    {
        user ? sethaslogin(true) : sethaslogin(false)
    }
    , []);
    return (
        <div className="App">
            {user && <NavigationBar />}
            <Toaster />

            <Routes>
              {!haslogin &&  <Route path="/login" element={<LoginRoute isSignedin={user}><Login/></LoginRoute>} />} 
                
                <Route
                    path="/"
                    element={
                        <PrivateRoute isSignedin={user}>
                            {' '}
                            <Home />{' '}
                        </PrivateRoute>
                    }
                />
                <Route path='/book' element={
                    <PrivateRoute isSignedin={user}>
                        <BookDetailPage/>
                    </PrivateRoute>
                }/>
            </Routes>
        </div>
    );
}

export default App;
