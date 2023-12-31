import React from 'react';
import Avatar from 'react-avatar';

function Component({fullname, email=null, picture=null, round=true}) {
    return (
        <>
            <div style={{ display: 'flex' }}>
                <Avatar style={{marginRight: '10px'}} size="40" src={picture} 
                    name={fullname} round={typeof round === "boolean" ? true : round} email={email}/>
                <span> </span>
                <div style={{ display: 'block' }}>
                    <div><b>{fullname}</b></div>
                    {email && <div>{email}</div>}
                </div>
            </div>
        </> 

    );
}

const avatar = React.memo(Component, (oldprops, newprops) => { return oldprops === newprops; })

export default avatar;
