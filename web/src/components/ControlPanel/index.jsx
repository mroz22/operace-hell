import React, { useState } from 'react';
// import * as firebase from 'firebase';
import Map from 'google-map-react';
import { Link, Wrapper, SectionDropwdown } from '../../components';
import * as CONF from '../../config';

const Point = ({ color }) => {
    return (
        <div style={{ height: '50px', width: '50px', backgroundColor: 'yellow' }}>
        </div>
    );
}

const ControlPanel = (props) => {
    const { game, role, bunkers, user, roles } = props;
    // const db = firebase.firestore();
    
    const [view, setView] = useState('world');

    if (!game || !role || !bunkers || !user) {
        return 'loading...'
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
                            roles.filter(r => !!r.geo).map(r => <Point />)
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