import React from 'react';
import Map from 'google-map-react';
import { Wrapper } from '..';
import * as CONF from '../../config';

const Point = () => {
        return (
            <div style={{ color: 'red' }}>
                <div style={{ fontSize: '4em'}}>
                {'😋'}
                </div>
            </div>
        )
}

const HuntingPanel = (props) => {
    const { roles } = props;

    if (!roles) {
        return 'loading...'
    }

    return (
        <Wrapper>
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
                            roles.filter(r => !!r.geo && r.status && r.status.hasEnteredSecretChamber).map(r => (
                                <Point
                                    key={r.name}
                                    lat={r.geo.lat}
                                    lng={r.geo.lng}
                                    />
                                )
                            )
                        }
                    </Map>
        </Wrapper>
    )    
}

export default HuntingPanel