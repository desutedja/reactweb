import React from 'react';
import MoonLoader from "react-spinners/MoonLoader";
import ClinkLoader from "./ClinkLoader";

function Loading({ loading, size=null, children=null }) {
    return (
        loading ? (
            <div className="Spinner">
                <ClinkLoader />
            </div>
        ) : children
    )
}

export default Loading;
