import React, { useState } from 'react';
import Avatar from 'react-avatar';

function Component({fullname, email}) {
    return (
                <>
                    <div style={{ display: 'flex' }}>
                        <Avatar style={{marginRight: '10px'}} size="40" name={fullname} round={true} email={email}/>
                        <span> </span>
                        <div style={{ display: 'block' }}>
                            <div><b>{fullname}</b></div>
                            <div>{email}</div>
                        </div>
                    </div>
                </> 

    );
}

export default Component;
