import React from 'react';
import MoonLoader from "react-spinners/MoonLoader";

function Component({ loading, children }) {
    return (
        loading ? (
            <div className="Spinner">
                <MoonLoader
                    size={24}
                    color={"silver"}
                    loading={loading}
                />
            </div>
        ) : children
    )
}

export default Component;