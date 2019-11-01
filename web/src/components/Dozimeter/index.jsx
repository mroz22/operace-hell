import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';

import { Wrapper, Option, Options, SectionDropwdown, Description, Input } from '../../components';
import QRCode from 'qrcode.react';
import QrReader from 'react-qr-reader'
import { 
    Bunker as BunkerSituation,
    SecretChamber,
} from '../Situation';
import Bunker from '../Zone/bunker';

const Dozimeter = (props) => {
    const { game, role, bunkers, user } = props;
    const db = firebase.firestore();
    
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
            }, 1000 * 60);
            
        } 

        return () => {}
    }, [db, role.uid])

    if (!game || !role || !bunkers || !user) {
        return 'loading...'
    }

    const currentBunker = bunkers.find(b => b.id === role.BunkerId);

    const updateUser = (data) => {
        return db.collection("users")
            .doc(user.uid)
            .set({
                ...role,
                ...data,
            });
    }
    const enterBunker = (BunkerId) => {
        return updateUser({ BunkerId })
    }

    const enterSecretChamber = () => {
        return updateUser({ hasEnteredSecretChamber: true })
    }

    const parseQr = (value) => {
        const delimiterIndex = value.indexOf(':');
        if (!delimiterIndex) {
            return {type: value};
        }
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

    const onEnterSecretChamber = async () => {
        await enterSecretChamber();
        onSituationCancel();
    }
    
    if (game.endEpoch - game.epoch <= 0) {
        return (
            <Wrapper>
                <Description>
                Prezil jsi. Dosahl jsi uspechu ve hre. Neni to grandiozni uspech, nepovedlo se ti odpojit 
                ze simulace, ale porad je to ok. Stroncnetu se jevis jako vhodny kandidat pro dalsi testovani a proto tvuj image zatim nesmaze.
                </Description>
            </Wrapper>

        )

    }
    switch (qr.type) {
        case 'bunker':
            return (
                <BunkerSituation
                    role={role}
                    bunker={bunkers.find(b => b.id === qr.id)}
                    onEnterBunker={onEnterBunker}
                    onSituationCancel={onSituationCancel} />
            );
        case 'secret-chamber':
            return (
                <SecretChamber
                    role={role}
                    onSituationCancel={onSituationCancel}
                    onEnter={onEnterSecretChamber}
                />
            );
            // no default
    }

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
            {/* <Link onClick={() => setView('world')}>Svet</Link> */}
            {/* <Link onClick={() => setView('me')}>Ja</Link> */}
            </div>

            <Options>
                <Option onClick={() => setQrReaderOpened(!qrReaderOpened)}>Precist QR</Option>
                { currentBunker && <Option onClick={()=>enterBunker("")}>Odejit z bunkru</Option> }
            </Options>

            <SectionDropwdown title={`Nachazis se ${currentBunker ? 'v bunkru' : 'pod sirym nebem'} ${game.radiation > 0 ? ' ☢': ''}`}>
                        {
                            currentBunker && <Bunker role={role} bunker={currentBunker} />
                        }
                        {
                            !currentBunker && (
                                <div style={{ fontSize: '3em', textAlign: 'center' }}>☢{' '}{game.radiation.toFixed(2)} mSv/H</div>
                            )
                        }
                    </SectionDropwdown>

                    <SectionDropwdown title="Vybaveni">
                        <Input type="checkbox" label="radiacni oblek" value={role.protectiveSuiteOn} onChange={() => {
                            updateUser({ protectiveSuiteOn: !role.protectiveSuiteOn })
                        }} />
                    </SectionDropwdown>
                    <SectionDropwdown title="Mutace 🐙 ☣ ☠ 💀">
                        Zatim nemas zadnou mutaci. Ale pozor, cim vice se budes vystavovat radiaci bez ochrany, roste sance, ze tvuj organismus zmutuje. To bude mit za nasledek zmenu tvych telesnych nebo dusevnich vlastnosti.
                    </SectionDropwdown>

                    <SectionDropwdown title="Osobni ID">
                        { role.uid && <QRCode value={role.uid} /> }
                    </SectionDropwdown>

                    <Description style={{ alignSelf: 'center', marginTop: 'auto', textAlign: 'center' }}>
                        Epoch do preziti: {game.endEpoch - game.epoch}
                    </Description>
        </Wrapper>
    )    
}

export default Dozimeter