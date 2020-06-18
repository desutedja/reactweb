import React, { useMemo } from 'react';
import Avatar from 'react-avatar';

function Component({fullname, email, picture=null, round=true}) {
    const avatar = useMemo(() => {
        return (<>
            <Avatar style={{marginRight: '10px'}} size="40" src={picture} 
                name={fullname} round={typeof round === "boolean" ? true : round} email={email}/>
            <span> </span>
        </>)
    });

    return (
                <>
                    <div style={{ display: 'flex' }}>
                        {avatar}
                        <div style={{ display: 'block' }}>
                            <div><b>{fullname}</b></div>
                            <div>{email}</div>
                        </div>
                    </div>
                </> 

    );
}

export default Component;
