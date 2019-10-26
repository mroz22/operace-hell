import React, { useState } from 'react';
// import * as firebase from 'firebase';
import Map from 'google-map-react';
import { Link, Wrapper, SectionDropwdown } from '../../components';
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
    const [view, setView] = useState('world');

    if (!game || !role || !bunkers || !user || !teams) {
        return 'loading...'
    }

    const getTeam = (r) => {
        return teams.find(t => t.id === r.TeamId);
    }

    return (
        <Wrapper>
            <div style={{ display: 'flex', flexDirection: 'row', 'justifyContent': 'space-between', marginBottom: '30px'}}>
                <Link onClick={() => setView('world')}>Svet</Link>
                <Link onClick={() => setView('stats')}>Statistiky</Link>
            </div>
            {
                view === 'world' && (
                    <>
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
                    </>
                )
            }

            {
                view === 'stats' && (
                    <>
                    <SectionDropwdown title="Zivi hraci">
                        obsah section
                    </SectionDropwdown>
                    </>
                )
            }
        </Wrapper>
    )    
}

export default ControlPanel