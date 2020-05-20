import React from 'react';

function Component({ children }) {
    return (
        <a href={children} target="_blank" rel="noopener noreferrer">{children}</a>
    )
}

export default Component;