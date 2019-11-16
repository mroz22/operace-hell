import React, { useState } from 'react';
import { Link, Section, BigButton } from '../../components';
import Profile from '../../components/Profile';
import Signup from '../../components/Signup';
import Signin from '../../components/Signin';
import Dozimeter from '../../components/Dozimeter';
import ControlPanel from '../../components/ControlPanel';
import HuntingPanel from '../../components/HuntingPanel';

export default (props) => {
    const [signup, setSignup] = useState(true);
    const [isGameView, setIsGameView] = useState(false);

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
    
    if (!props.role) {
        return;
    }

    let component = null;
    if (props.role.roleType === 'pruzkumnik') {
        component = (<Dozimeter
            characters={props.characters}
            game={props.game}
            role={props.role}
            bunkers={props.bunkers}
            user={props.user}
            roles={props.roles}
            />);
    }

    if (props.role.roleType === 'divoky') {
        component = (
            <HuntingPanel
                game={props.game}
                roles={props.roles}
                />
        )
    }

    if (props.role.roleType === 'org') {
        component = (
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

    if (isGameView) {
        return (
            <>
            {props.game && props.game.isPaused && <div style={{ backgroundColor: 'red', color: 'white' }}>Hra nebezi</div>}
            {props.game && props.game.isBeta && <div style={{ backgroundColor: 'blue', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                <Link onClick={() => setIsGameView(!isGameView)}> zpet do profilu</Link>
                Hra je nastavena na beta mod
            </div>}

            {component}
            </>
        )
    }

    return (
        <div>
            {props.game && props.game.isBeta && <div style={{ backgroundColor: 'blue', color: 'white' }}>
                <Link onClick={() => setIsGameView(!isGameView)}>Zapnout beta apku</Link>
            </div>}
            
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
                />
            </div>
            <Section>
                <BigButton text="LEAVE" onClick={() => props.setIsProfileView(false)} />
            </Section>
        </div>
    );
}

