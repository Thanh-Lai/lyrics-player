import React from 'react';
import defaultProfile from '../../../public/default-profile.png';

export default function LogginButton({ loginInfo, handleClick }) {
    if (Object.keys(loginInfo).length) {
        return (
            <li>
                <button type="button" id="loginBtn" onClick={handleClick.out}>Log Out</button>
                <div id="user">
                    <img id="profilePic" alt="profilePic" src={loginInfo.images[0].url || defaultProfile} />
                    {loginInfo.display_name}
                </div>
            </li>
        );
    }
    return (
        <li><button type="button" id="loginBtn" onClick={handleClick.in}>Log In</button></li>
    );
}
