import React, { useState } from 'react';
import * as firebase from 'firebase';

import { Link } from '../../components';
import QRCode from 'qrcode.react';
import QrReader from 'react-qr-reader'

import { Wrapper, Option, Options, Heading } from './components';
import { Bunker } from '../Situation';

const Dozimeter = (props) => {
    const { game, role, bunkers, user, setIsGameView } = props;
    const db = firebase.firestore();
    
    const [view, setView] = useState('world');
    const [qr, setQr] = useState({ type: undefined, value: undefined });
    const [qrReaderOpened, setQrReaderOpened] = useState(false);

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

    const notifyMe = () => {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
          alert("This browser does not support desktop notification");
        }
      
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
          // If it's okay let's create a notification
          new Notification("Hi there!");
        }
      
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
             new Notification("Hi there!");
            }
          });
        }
    }

      

    switch (qr.type) {
        case 'bunker':
            return (
                <Bunker
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
            <Link onClick={() => setView('me')}>{ role.characterId }</Link>
            <Link onClick={() => setQrReaderOpened(!qrReaderOpened)}>Precist qr</Link>

            <Link onClick={() => setIsGameView(false)}>osobni udaje</Link>
            </div>
            {
                view === 'world' && (
                    <>
                        
                        {
                            currentBunker && (
                                <>
                                    <div>V bunkru {currentBunker.name}</div>
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
                                <div style={{ fontSize: '3em', textAlign: 'center' }}>{game.radiation.toFixed(2)} mSv/H</div>
                                <Options>
                                    <Option onClick={()=>notifyMe()}>Notifikace</Option>
                                </Options>
                                </>
                            )
                        }
                        

                    </>
                )
            }

            {
                view === 'me' && (
                    <>
                    <Heading>
                    Mutace
                    </Heading>

                    <Heading>
                        Osobni ID
                    </Heading>
                    { role.uid && <QRCode value={role.uid} /> }
                    </>
                )
            }

            

        </Wrapper>
    )    
}

export default Dozimeter