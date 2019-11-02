import React, { useState } from 'react';
import * as firebase from 'firebase';
import Map from 'google-map-react';
import { Wrapper, SectionDropwdown, Option, Options, Input } from '../../components';
import * as CONF from '../../config';

const Point = ({ role, team }) => {
    if (role.roleType === 'pruzkumnik') {
        const color = (team && team.color) || CONF.GREEN;
        return (
            <div style={{ color }}>
                <div>{role.name}</div>
                <div style={{ fontSize: '4em'}}>
                { role.roleType === 'pruzkumnik' && '😋'}
                </div>
            </div>
        )
    }

    return (
        <div style={{ color: 'violet' }}>
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
    const [isPending, setIsPending ] = useState(false);
    const [result, setResult] = useState('');
    const [reallyReset, setReallyReset] = useState(false);

    if (!game || !role || !bunkers || !user || !teams) {
        return 'loading...'
    }

    const resetGame = async () => {
        if (isPending) return;
        try {
            setResult('');
            setIsPending(true);
            const result = await callReset()
            setResult(result.data)
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
                    <SectionDropwdown title="mapa">
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
                            roles.filter(r => !!r.geo).map(r => (
                                <Point
                                    key={r.name}
                                    lat={r.geo.lat}
                                    lng={r.geo.lng}
                                    role={r}
                                    team={getTeam(r)}
                                    />
                                )
                            )
                        }
                    </Map>
                    </SectionDropwdown>
                    <SectionDropwdown title="Zivi hraci">
                        obsah section
                    </SectionDropwdown>
                    <SectionDropwdown title="Reset hry">
                        <Input type="checkbox" label="Opravdu?" onChange={() => setReallyReset(!reallyReset)}></Input>
                        <Options>
                            {
                                reallyReset && !isPending && <Option onClick={resetGame}>Resetovat hru</Option> 
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