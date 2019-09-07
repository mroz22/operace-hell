import React, { useState, useEffect } from 'react';

const FadeIn = ({ children, opacity }) => (
    <div style={{
        transition: 'all 2s',
        opacity: opacity,
        height: '100%',
    }}>
        {children}
    </div>
)
const Preloader = (props) => {
    const [i, setI] = useState(0);
    const LIMIT = 2;

    useEffect(() => {
        let interval = setInterval(() => {
            setI(i+1)
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    })

    return (
        <>
            <FadeIn opacity={i > LIMIT ? 1:0}>{props.children}</FadeIn>
        </>
    )
};

export default Preloader;
