import React from 'react';
import MoonLoader from "react-spinners/MoonLoader";

function Loading({ loading, size=null, children=null }) {
    return (
        loading ? (
            <div className="Spinner">
                <MoonLoader
                    size={size ? size : 24}
                    color={"grey"}
                    loading={loading}
                />
            </div>
        ) : children
    )
}

export default Loading;
