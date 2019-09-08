import React from 'react';

import Input from './Input';

const styles = {
    h: {
        fontSize: '2em',
        marginBottom: '5px',
    },
    p: {
        textAlign: 'justify',
        marginBottom: '5px',
    }
};

const H = (props) => (<div style={styles.h}>{props.children}</div>);

const P = (props) => (<div style={styles.p}>{props.children}</div>);

export { H, P, Input }