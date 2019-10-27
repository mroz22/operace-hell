import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';

import { Link, Wrapper, Option, Options, SectionDropwdown } from '../../components';
import QRCode from 'qrcode.react';
import QrReader from 'react-qr-reader'
import { Bunker as BunkerSituation } from '../Situation';
import Bunker from '../Zone/bunker';

const Dozimeter = (props) => {
    const { game, role, bunkers, user } = props;
    const db = firebase.firestore();
    
    const [view, setView] = useState('world');
    const [qr, setQr] = useState({ type: undefined, value: undefined });
    const [qrReaderOpened, setQrReaderOpened] = useState(false);

    useEffect(() => {
        console.log('useeffect called madafaka')
        const updateGeo = (uid, lat, lng) => {
            if (!uid || !lat || !lng) return;
            db.collection('users').doc(uid).update({
                "geo.lat": lat,
                "geo.lng": lng,
            });
        }
        if (navigator.geolocation) {
            setInterval(() => {
                const onSuccess = (pos) => {
                    console.log(pos);
                    updateGeo(role.uid, pos.coords.latitude, pos.coords.longitude)
                }
                const onError = (err) => {
                    console.log(err)
                }
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            }, 1000 * 10);
            
        } 

        return () => {}
    }, [db, role.uid])

    if (!game || !role || !bunkers || !user) {
        return 'loading...'
    }

    const currentBunker = bunkers.find(b => b.id === role.BunkerId);

    const enterBunker = (BunkerId) => {
        return db.collection("users")
            .doc(user.uid)
            .set({
                ...role,
                BunkerId,
            });
    }

   

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

    // const getServerTimestampFormatted = () => {
    //     const date = new Date(game.timestamp*1000);
    //     const hours = date.getHours();
    //     const minutes = "0" + date.getMinutes();
    //     const seconds = "0" + date.getSeconds();
    //     return  hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    // }

    const onSituationCancel = () => {
        setQr({ type: undefined, value: undefined})
    }

    const onEnterBunker = async (BunkerId) => {
        await enterBunker(BunkerId);
        onSituationCancel();
    }

    

    switch (qr.type) {
        case 'bunker':
            return (
                <BunkerSituation
                    role={role}
                    bunker={bunkers.find(b => b.id === qr.id)}
                    onEnterBunker={onEnterBunker}
                    onSituationCancel={onSituationCancel} />
            )
            // no default
    }
    console.log(role);

    if (qrReaderOpened) {
        return (
            <Wrapper>
        <Options>
            <Option onClick={() => setQrReaderOpened(false)}>Zavrit</Option>
        </Options>
        <QrReader
            delay={300}
            onError={(value) => onQrRead()}
            onScan={(value) => onQrRead(value)}
            style={{ width: '100%' }}
        />
        </Wrapper>
    )
    } 
    return (
        <Wrapper>
            <div style={{ display: 'flex', flexDirection: 'row', 'justifyContent': 'space-between', marginBottom: '30px'}}>
            <Link onClick={() => setView('world')}>Svet</Link>
            <Link onClick={() => setView('me')}>Ja</Link>
            <Link onClick={() => setQrReaderOpened(!qrReaderOpened)}>Precist qr</Link>
            </div>
            {
                view === 'world' && (
                    <>
                        
                        {
                            currentBunker && (
                                <>
                                    <div>V bunkru</div>
                                    <Bunker role={role} bunker={currentBunker} />
                                    <Options>
                                        <Option onClick={()=>enterBunker("")}>Odejit</Option>
                                    </Options>
                                </>
                            )
                        }

                        {
                            !currentBunker && (
                                <>
                                <div>Pod sirym nebem</div>
                                <div style={{ fontSize: '3em', textAlign: 'center' }}>☢{game.radiation.toFixed(2)} mSv/H</div>
                                </>
                            )
                        }
                        

                    </>
                )
            }

            {
                view === 'me' && (
                    <>
                    <SectionDropwdown title="Mutace 🐙 ☣ ☠ 💀">
                        obsah section
                    </SectionDropwdown>

                    <SectionDropwdown title="Osobni ID">
                        { role.uid && <QRCode value={role.uid} /> }
                    </SectionDropwdown>
                    </>
                )
            }

            

        </Wrapper>
    )    
}

export default Dozimeter