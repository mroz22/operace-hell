import React, { useState } from 'react';
import styled from 'styled-components';

import { GREEN } from '../config';

import Input from './Input';
import Section from './Section';

const styles = {
    h: {
        fontSize: '2em',
        marginBottom: '5px',
    },
    p: {
        textAlign: 'justify',
        marginTop: '2pt',
        marginBottom: '5pt',
    },
    link: {
        textDecoration: 'underline',
        cursor: 'pointer',
    }
};

const H = (props) => (<div style={styles.h} {...props}>{props.children}</div>);

const P = (props) => (<div style={styles.p} {...props}>{props.children}</div>);

const Link = (props) => (<P style={styles.link} {...props}>{props.children}</P>);

const BigButton = ({ onClick, text }) => (
    <div style={{ textAlign: 'center', fontSize: '18pt', cursor: 'pointer'}} onClick={onClick}>
        @@@@@@@@@@@<br />
        ==={text}===<br />
        @@@@@@@@@@@
    </div>
);

const SectionDivider = (props) => (
    <div style={{
        borderBottom: 'black 1px dashed',
        borderTop: 'black 1px dashed',
        textAlign: 'center',
        paddingTop: '10px',
        paddingBottom: '10px',
        marginTop: '20px',
        marginBottom: '20px',
    }}>
        { props.children }
    </div>
) 


const Wrapper = styled.div`
    background-color: black;
    color: ${GREEN};
    height: 100%;
    padding: 0 4% 0 4%;
    display: flex;
    flex-direction: column;
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
    margin-top: 4px;
    margin-bottom: 4px;
    padding: 10px;
`

const Heading = styled.div`
    width: 100%;
    border: ${GREEN} dashed 1px;
    text-align: center;
`;

const SectionDropwdown = ({ title, icons, children }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
        <Option onClick={() => setOpen(!open)}>
        <span>
        { open ? "▲":"▼"} {' '}
        {title}
        </span>
        <span>{icons}</span>
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
    H,
    P,
    Link,
    Input,
    SectionDivider,
    Section,
    BigButton,
    Wrapper,
    Option,
    Options,
    Description,
    Heading,
    SectionDropwdown,
 }