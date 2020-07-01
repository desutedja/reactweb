import React from 'react';

function Template({children, role}) {

    return (
        <div className="Auth">
            <div className="Auth-center">
                <p
                    className="Title"
                    style={{
                        marginBottom: 32,
                        fontWeight: 'bold',
                    }}
                >{role === 'sa' ? "Superadmin" : "Management"} Login</p>
                {children}
            </div>
        </div>
    )
}

export default Template;