import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TitlePage from './pages/TitlePage/Titlepage'; // Import TitlePage component
import LoginPage from './pages/Loginpage/Loginpage';
import './App.css'; // Optional: Import any global CSS styles if necessary
import GenApp from './pages/generatorpage/gen';
import MyPosts from './pages/Mypost/mypost';
import NewsPage from './pages/news/news';
import { AuthProvider } from './pages/Loginpage/auth';
import ProtectedRoute from './pages/Loginpage/protect';
import DashboardPage from './pages/d/dp';
// function App() {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<TitlePage />} /> {/* Set TitlePage as the main landing page */}
//                 <Route path="Login" element={<LoginPage/>}></Route>
//                 <Route path="/generator" element={<GenApp/>}></Route> 
//                 <Route path="/myposts" element={<MyPosts/>}></Route>
//                 <Route path="/news" element={<NewsPage/>}></Route>
//             </Routes>
//         </Router> 
//     );
// }
function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<TitlePage />} /> {/* Set TitlePage as the main landing page */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dp" element={<DashboardPage/>}/>
                    <Route 
                        path="/generator" 
                        element={
                            <ProtectedRoute>
                                <GenApp />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/myposts" 
                        element={
                            <ProtectedRoute>
                                <MyPosts />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/news" 
                        element={
                            <ProtectedRoute>
                                <NewsPage />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}



export default App;  