import React, {  } from 'react';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser';

function Component() {
    const { selected } = useSelector(state => state.ads);

    return (
        <div>
            <div style={{
                display: 'flex',
                marginTop: 16,
                paddingLeft: 8,
            }}>
                <div style={{
                    flex: 1
                }}>
                    {selected.media_url ?
                        <img className="Logo" src={selected.content_image} alt="media_url" />
                        :
                        <img src={'https://via.placeholder.com/200'} alt="media_url" />
                    }
                </div>
                <div className="ml-4" style={{
                    flex: 3
                }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: 8 }}>
                        {selected.content_name ? selected.content_name : "(No Title)"}
                    </p>
                    {selected.content_description ? parse(selected.content_description) : "(No content)"}
                </div>
            </div>
        </div>
    )
}

export default Component;
