import React from 'react';

const Section = (props) => (
    <div style={{
        backgroundColor: 'white',
        padding: '30px 15% 30px 15%',
        opacity: 0.85,
        borderRadius: '5px',
    }}>
        { props.children }
    </div>
);

export default Section;