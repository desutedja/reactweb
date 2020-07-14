import React from 'react';
import MoonLoader from "react-spinners/MoonLoader";

function Loading({ loading, children }) {
    return (
        loading ? (
            <div className="Spinner">
                <MoonLoader
                    size={24}
                    color={"grey"}
                    loading={loading}
                />
            </div>
        ) : children
    )
}

export default Loading;