import React, { useState } from 'react';
// import * as firebase from 'firebase';

import { Link, SectionDivider } from '../../components';
import QRCode from 'qrcode.react';
import QrReader from 'react-qr-reader'

const ResolveBunker = () => {
    return (
        <div style={{ height: '100vh', width: '100vw', zIndex: 100 }}>
            Resolve bunker
        </div>
    )
}
const Dozimeter = (props) => {
    const { game, role, bunkers, user, setIsGameView } = props;
    // const db = firebase.firestore();

    const [qr, setQr] = useState({ type: undefined, value: undefined });
    const [qrReaderOpened, setQrReaderOpened] = useState(false);

    if (!game || !role || !bunkers || !user) {
        return 'loading...'
    }

    // const enterBunker = (BunkerId) => {
    //     db.collection("users")
    //         .doc(user.uid)
    //         .set({
    //             ...role,
    //             BunkerId,
    //         });
    // }

    const parseQr = (value) => {
        const delimiterIndex = value.indexOf(':');
        const type = value.substr(0, delimiterIndex);
        const id = value.substr(delimiterIndex+1);
        return {type, id};
    }

    const onQrRead = (value) => {
        console.log(value);
        if (!value) {
            return;
        }
        setQrReaderOpened(false);
        setQr(parseQr(value));
    }

    const getServerTimestampFormatted = () => {
        const date = new Date(game.timestamp*1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const seconds = "0" + date.getSeconds();
        return  hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    switch (qr.id) {
        case 'bunker':
            return <ResolveBunker />
            // no default
    }

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '30px 15% 130px 15%',
        }}>
            <Link onClick={() => setIsGameView(false)}>osobni udaje</Link>
            Game view
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
            { role.uid && <QRCode value={role.uid} /> }
            <SectionDivider>
                Stav
            </SectionDivider>

            { role.BunkerId ? "V bunkru": "Pod sirym nebem"}

            {
                qrReaderOpened && (
                    <QrReader
                        delay={300}
                        onError={(value) => onQrRead()}
                        onScan={(value) => onQrRead(value)}
                        style={{ width: '100%' }}
                    />
                )
            }
            <Link onClick={() => setQrReaderOpened(!qrReaderOpened)}>Precist qr</Link>
            qr: {JSON.stringify(qr)}
            

        </div>
    )    
}

export default Dozimeter