import React, { useState } from 'react';
import { Link, Section, BigButton, Wrapper, Description } from '../../components';
// import Profile from '../../components/Profile';
import Signup from '../../components/Signup';
import Signin from '../../components/Signin';
import Dozimeter from '../../components/Dozimeter';
import ControlPanel from '../../components/ControlPanel';
import HuntingPanel from '../../components/HuntingPanel';

export default (props) => {
    const [signup, setSignup] = useState(true);
    // const [isGameView, setIsGameView] = useState(false);

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

    const BetaPanel = (
        <div style={{ backgroundColor: 'blue', color: 'white' }}>
            <Link onClick={() => props.setIsProfileView(false)}> zpet na web</Link> {' '}
            Hra je nastavena na beta mod. Kdyby vam neco nefungovalo, dejte vedet.
        </div>
    );

    if (props.game && props.game.END_EPOCH - props.game.epoch <= 0) {
        if (props.role && props.role.roleType === 'pruzkumnik') {
                return (
                    <>
                        {props.game.isBeta && <BetaPanel />}
                        <Wrapper>
                            <Description>
                            Nastal konec zony. Pokud jsi prezil, je to uspech.
                            </Description>
                        </Wrapper>
                    </>
                )
        }
        if (props.role && props.role.roleType === 'divoky') {
            return (
                <>
                {props.game.isBeta && <BetaPanel />}
                <Wrapper>
                    <Description>
                        Nastal konec zony. Vrat se do stanoviste orgu. 
                    </Description>
                </Wrapper>
                </>
            )   
        }
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
            teams={props.teams}
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

    // if (isGameView) {
        return (
            <>
            {props.game && props.game.isPaused && <div style={{ backgroundColor: 'red', color: 'white' }}>Hra je pauznuta</div>}
            {props.game && props.game.isBeta && <BetaPanel />}
            {component}
            </>
        )
    // }

    // return (
    //     <div>
    //         <div style={{ backgroundColor: 'blue', color: 'white' }}>
    //             <Link onClick={() => setIsGameView(!isGameView)}>Zapnout beta apku</Link>
    //         </div>
            
    //         <div style={{
    //             backgroundColor: 'white',
    //             padding: '30px 15% 130px 15%',
    //         }}>
    //             <Profile
    //                 user={props.user}
    //                 characters={props.characters}
    //                 roles={props.roles}
    //                 role={props.role}
    //                 teams={props.teams}
    //             />
    //         </div> 
    //         <Section>
    //             <BigButton text="LEAVE" onClick={() => props.setIsProfileView(false)} />
    //         </Section>
    //     </div>
    // );
}

