import React from 'react';

import { Link, SectionDivider } from '../../components';
import QRCode from 'qrcode.react';


const Dozimeter = (props) => {
    const { game, role, bunkers, setIsGameView } = props;

    if (!game || !role || !bunkers) {
        return 'loading...'
    }

    const getServerTimestampFormatted = () => {
        const date = new Date(game.timestamp*1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const seconds = "0" + date.getSeconds();
        return  hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '30px 15% 130px 15%',
        }}>
            <Link onClick={() => setIsGameView(false)}>osobni udaje</Link>
            Game view
            {JSON.stringify(game)}
            <SectionDivider>
            Radiace
            </SectionDivider>

            { getServerTimestampFormatted()} <br />            
            {game.radiation.toFixed(2)}

            <SectionDivider>
            Mutace
            </SectionDivider>

            <SectionDivider>
                Osobni ID
            </SectionDivider>
            {JSON.stringify(role)}
            { role.uid && <QRCode value={role.uid} /> }
            <SectionDivider>
                Stav
            </SectionDivider>

            {JSON.stringify(bunkers)}   <br />
            { role.BunkerId ? "V bunkru": "Pod sirym nebem"}


        </div>
    )    
}

export default Dozimeter