import React from 'react';
import ClinkLoader from "./ClinkLoader";

function Loading({ loading, size=null, children=null, style = {} }) {
    return (
        loading ? (
            <div className="Spinner" style={style}>
                <ClinkLoader />
            </div>
        ) : children
    )
}

export default Loading;
