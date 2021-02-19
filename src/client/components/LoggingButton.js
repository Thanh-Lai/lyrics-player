import React from 'react';
import platform from 'platform';
import defaultProfile from '../../../public/images/default-profile.png';
import '../style/navBar.css';

export default function LogginButton({ handleClick }) {
    const storage = JSON.parse(localStorage.getItem(`Spotify_${platform.name}`));
    const profile = storage ? storage.profileInfo : {};
    if (Object.keys(profile).length) {
        const image = profile.images.length ? profile.images[0].url : defaultProfile;
        return (
            <li>
                <button type="button" id="loginBtn" onClick={handleClick.out}>Log Out</button>
                <div id="user">
                    <img id="profilePic" alt="profilePic" src={image} />
                    {profile.display_name}
                </div>
            </li>
        );
    }
    return (
        <li><button type="button" id="loginBtn" onClick={handleClick.in}>Log In</button></li>
    );
}
