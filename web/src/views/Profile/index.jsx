import React, { useState } from 'react';
import { Link, Section, BigButton } from '../../components';
import Profile from '../../components/Profile';
import Signup from '../../components/Signup';
import Signin from '../../components/Signin';
import Dozimeter from '../../components/Dozimeter';
import ControlPanel from '../../components/ControlPanel';

export default (props) => {
    const [signup, setSignup] = useState(true);

    const getParameterByName = (name, url) => {
        if (!url) url = window.location.href;
        // eslint-ignore-next-line
        name = name.replace(/[[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    
    const [isGameView, setIsGameView] = useState(getParameterByName('experimental') === 'true');

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
                <BigButton text="LEAVE" onClick={() => props.setIsProfileView(false)} />
            </Section>
            </>
        ) 
    }

    if (!isGameView) {
        return (
            <div>
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px 15% 130px 15%',
                }}>
                    <Profile
                        user={props.user}
                        characters={props.characters}
                        roles={props.roles}
                        role={props.role}
                        teams={props.teams}
                        isGameView={isGameView}
                        setIsGameView={setIsGameView}
                    />
                </div>
                <Section>
                    <BigButton text="LEAVE" onClick={() => props.setIsProfileView(false)} />
                </Section>
            </div>
        );
    }

    if (props.role && props.role.roleType === 'pruzkumnik') {
        return (
            <Dozimeter
                game={props.game}
                role={props.role}
                bunkers={props.bunkers}
                user={props.user}
                setIsGameView={setIsGameView} />
        )
    }

    if (props.role && props.role.roleType === 'org') {
        return (
            <ControlPanel
                game={props.game}
                role={props.role}
                roles={props.roles}
                bunkers={props.bunkers}
                user={props.user}
                teams={props.teams}
                />
        )
    }

    return null;
}

