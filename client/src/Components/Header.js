import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    // State to track user authentication status
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');


    // Function to handle logout
    const handleLogout = () => {
        // Perform logout actions and update isLoggedIn state accordingly
        setIsLoggedIn(false);
    };

    return (
        <div>
            <header className='header1'>
                <nav>
                    <div className='left'>
                        <h1>RAIDD</h1>
                    </div>
                    <div className='right'>
                        <ul>
                            <li>
                                <Link to='/'>
                                    Home
                                </Link>
                            </li>
                            {isLoggedIn && (
                                <li>
                                    <Link to='/dashboard'>
                                        Dashboard
                                    </Link>
                                </li>
                            )}
                            {!isLoggedIn ? (
                                <li>
                                    <Link to='/login'>
                                        Login
                                    </Link>
                                </li>
                            ) : (
                                <>
                                {/* Render profile picture if user is logged in */}
                                <li>
                                    <img src={profilePicture} alt="Profile" />
                                </li>
                                <li onClick={handleLogout}>Logout</li>
                            </>
                            )}
                        </ul>
                    </div>
                </nav>
            </header>
        </div>
    );
}

export default Header;