import React, { useState } from 'react';
import styled from 'styled-components';
import { GREEN } from '../../config';

const Wrapper = styled.div`
    background-color: black;
    color: ${GREEN};
    height: 100%;
    padding: 4%;
`

const Description = styled.div`
    margin-bottom: 10px;
`;

const Options = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
`

const Option = styled.div`
    widht: 100%;
    border: ${GREEN} dashed 1px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px;
`

const Heading = styled.div`
    width: 100%;
    border: ${GREEN} dashed 1px;
    text-align: center;
`;

const Section = ({ title, children }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
        <Option onClick={() => setOpen(!open)}>
        { open ? "▲":"▼"} {' '}
        {title}
        </Option>
        {
            open && (
                <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    {children}
                </div>
            )
        }

        </>
    )
};

export {
    Wrapper,
    Option,
    Options,
    Description,
    Heading,
    Section,
};