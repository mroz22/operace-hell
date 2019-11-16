import React, { useState } from 'react';
import * as firebase from 'firebase';
import Map from 'google-map-react';
import { Wrapper, SectionDropwdown, Option, Options, Input } from '../../components';
import * as CONF from '../../config';

const Point = ({ role, team }) => {
    const [open, setOpened] = useState(false);
    if (open) {
        return (
            <div style={{ border: `4px solid ${team && team.color ? team.color : CONF.GREEN}`, backgroundColor: 'white', color: 'black', padding: '5px', minWidth: '200px', display: 'flex', flexDirection: 'column' }} onClick={() => setOpened(false)}>
                <div>Jmeno: {role.name}</div>
                <div>Mutace: {role.status.mutations.map(m => (`${m.name}, `))}</div>
                <div>Radiace {role.status.radiation.toFixed(2)}</div>
                <div>Vstoupil do bunkru: {role.status.hasEnteredSecretChamber ? 'Ano': 'Ne'}</div>
            </div>
        )
    }
    
    if (role.roleType === 'pruzkumnik') {
        const color = (team && team.color) || CONF.GREEN;
        return (
            <div style={{ color }} onClick={() => setOpened(true)}>
                <div>{role.name}</div>
                <div style={{ fontSize: '4em'}}>
                { role.roleType === 'pruzkumnik' && '😋'}
                </div>
            </div>
        )
    }

    return (
        <div style={{ color: 'violet' }} onClick={() => setOpened(true)}>
            <div>{role.name}</div>
            <div style={{ fontSize: '4em'}}>
            { role.roleType === 'divoky' && '🎃'}
            { role.roleType === 'org' && '🎬'}
            </div>
        </div>
    )
}

const ControlPanel = (props) => {
    const { game, role, bunkers, user, roles, teams } = props;
    // const db = firebase.firestore();
    const callReset = firebase.functions().httpsCallable('resetGame');
    const callTogglePause = firebase.functions().httpsCallable('togglePause');

    const [isPending, setIsPending ] = useState(false);
    const [result, setResult] = useState('');
    const [reallyReset, setReallyReset] = useState(false);
    const [beta, setBeta] = useState(false);

    if (!game || !role || !bunkers || !user || !teams) {
        return 'loading...'
    }

    const resetGame = async () => {
        if (isPending) return;
        try {
            setResult('');
            setIsPending(true);
            const result = await callReset({ type: beta ? 'beta': 'production'})
            setResult(result.data)
        } catch (err) {
            setResult('error')
        } finally {
            setIsPending(false);
        }
    }

    const togglePause = async () => {
        if (isPending) return;
        try {
            setIsPending(true);
            await callTogglePause()
        } catch (err) {
            setResult('error')
        } finally {
            setIsPending(false);
        }
    }

    const getTeam = (r) => {
        return teams.find(t => t.id === r.TeamId);
    }

    return (
        <Wrapper>
                    {/* <SectionDropwdown title="Zivi hraci">
                        obsah section
                    </SectionDropwdown> */}
                    <Map
                        bootstrapURLKeys={{ key: CONF.MAP_API_KEY }}
                        defaultCenter={{
                            lat: CONF.MAP_DEFAULT_LAT,
                            lng: CONF.MAP_DEFAULT_LNG
                        }}
                        defaultZoom={CONF.MAP_DEFAULT_ZOOM}
                        options={() => {
                            return {
                                mapTypeId: 'satellite'
                            }
                        }}
                    >
                        {
                            roles.filter(r => !!r.geo).map((r, index) => (
                                <Point
                                    key={`${r.name}-${index}`}
                                    lat={r.geo.lat}
                                    lng={r.geo.lng}
                                    role={r}
                                    team={getTeam(r)}
                                    />
                                )
                            )
                        }
                    </Map>
                    <SectionDropwdown title="Pauza">
                        <Options>
                            {
                                !isPending && game.isPaused && <Option onClick={togglePause}>Odpauzovat</Option> 
                            }
                            {
                                !isPending && !game.isPaused && <Option onClick={togglePause}>Zapauzovat</Option> 
                            }
                            {
                                isPending && 'Maka se na tom...'
                            }
                            
                        </Options>
                    </SectionDropwdown>
                    <SectionDropwdown title="Reset hry">
                        <Input type="checkbox" label="Opravdu?" onChange={() => setReallyReset(!reallyReset)}></Input>
                        
                        <Options>
                            {
                                reallyReset && !isPending && (
                                    <>
                                    <Input type="checkbox" label="Beta?" onChange={() => setBeta(!beta)}></Input>
                                    <Option onClick={resetGame}>Resetovat hru</Option>
                                    </>
                                ) 
                            }
                            {
                                isPending && 'Resetuje se...'
                            }
                            
                        </Options>
                        { result }
                    </SectionDropwdown>
        </Wrapper>
    )    
}

export default ControlPanel