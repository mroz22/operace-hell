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

export { H, P, Link, Input, Section }