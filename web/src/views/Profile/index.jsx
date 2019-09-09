import React, { useState } from 'react';

import { Link, Section } from '../../components';
import Profile from '../../components/Profile';
import Signup from '../../components/Signup';
import Signin from '../../components/Signin';

const Leave = ({ onClick}) => (
        <div style={{ textAlign: 'center', fontSize: '18pt', cursor: 'pointer'}} onClick={onClick}>
            @@@@@@@@@@@<br />
            ===LEAVE===br />
            @@@@@@@@@@@
        </div>
);

export default (props) => {
    const [signup, setSignup] = useState(true);
    if (!props.user) {
        return (
            <>
            <Section>
                <Link onClick={() => setSignup(!signup)}>{signup ? 'Chci se prihlasit': 'Chci se zaregistrovat'}</Link>
                <br />

                { !signup && <Signin /> }
                { signup && <Signup /> }
                
            </Section>
            <Section>
                <Leave onClick={() => props.setIsProfileView(false)} />
            </Section>
            </>
        ) 
    }

    return (
        <div>
            <Section>
                <Profile user={props.user} characters={props.characters} role={props.role} />
            </Section>
            <Section>
                <Leave onClick={() => props.setIsProfileView(false)} />
            </Section>
        </div>
    );
    
}

