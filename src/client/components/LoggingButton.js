import React from 'react';
import { connect } from 'react-redux';
import defaultProfile from '../../../public/default-profile.png';

function LogginButton({ profile, handleClick }) {
    if (Object.keys(profile).length) {
        return (
            <li>
                <button type="button" id="loginBtn" onClick={handleClick.out}>Log Out</button>
                <div id="user">
                    <img id="profilePic" alt="profilePic" src={profile.images[0].url || defaultProfile} />
                    {profile.display_name}
                </div>
            </li>
        );
    }
    return (
        <li><button type="button" id="loginBtn" onClick={handleClick.in}>Log In</button></li>
    );
}

const mapStateToProps = (state) => {
    return {
        profile: state.profileInfo
    };
};

export default connect(mapStateToProps, null)(LogginButton);
