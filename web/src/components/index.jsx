import React from 'react';

import Input from './Input';
import Section from './Section';

const styles = {
    h: {
        fontSize: '2em',
        marginBottom: '5px',
    },
    p: {
        textAlign: 'justify',
        marginBottom: '5px',
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

export { H, P, Link, Input, SectionDivider, Section, BigButton }