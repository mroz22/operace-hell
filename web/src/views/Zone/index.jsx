import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase';

import { H, P } from '../../components';

const BunkerCard = ({ children, style }) => {
    return (<div className="col" style={{
        margin: '10px',
        padding: '10px',
        backgroundColor: '#000000e0',
        borderRadius: '3px',
        color: 'white',
        ...style,
    }}>
        {children}
    </div>)
}

const Zone = () => {
    const [game, setGame] = useState(null);
    const [bunkers, setBunkers] = useState([]); 
    const db = firebase.firestore();

    const getGame = () => {
        db
        .collection("game")
        .doc("operacexxx")
        .onSnapshot(function(doc) {
            setGame(doc.data());
        });
    }

    const getBunkers = () => {
        db.collection("bunkers").onSnapshot(function(querySnapshot) {
            const newBunkers = [];
            querySnapshot.forEach(function(doc) {
                newBunkers.push({ id: doc.id,...doc.data()});
            });
            setBunkers(newBunkers);
        });
    }

    const enterBunker = (bunker) => {
        db.collection('bunkers').doc(bunker.id).set({
            ...bunker,
            numberOfUsers: bunker.numberOfUsers + 1,
        })
    }

    const leaveBunker = (bunker) => {
        if (bunker.numberOfUsers > 0) {
            return db.collection('bunkers').doc(bunker.id).set({
                ...bunker,
                numberOfUsers: bunker.numberOfUsers - 1,
            })
        }
        throw new Error('cant leave if nobodys inside');
        
    }

    useEffect(() => {
        getGame();
        getBunkers();
    }, [])

    const countConsumption = (bunker) => {
        if (bunker.numberOfUsers === 0) {
            return 0;
        }
        return bunker.numberOfUsers * 0.1;
    }

    const getTimeToZero = (bunker) => {
        return bunker.oxygen / countConsumption(bunker);
    }

    const getTimeToFull = (bunker) => {
        return (bunker.oxygenCap - bunker.oxygen) / (bunker.oxygenGeneration - countConsumption(bunker));
    }

    return (
        <div>
        <H>Zóna</H>
        <P>Hra se odehrává v...</P>
        <P>
            V Zóně působí radiace, jejíž aktuální úroveň je {game ? `${game.radiation}/100` : '?'}.
            Úroveň radiace je kolísavá. O její aktuální síle bude hráče informovat osobní dozimetr (aplikace do smartfounu).
            Radiace téměř nepůsobí na osoby v ochranném obleku a je zcela odstíněná v bunkrech. Kumulované ozáření způsobuje mutace,
            o nichž bude hráče informovat jejich aplikace.
        </P>

        <H>Bunkry</H>
        <P>
            V zóně se nachází několik bunkrů. Dokud je bunkr v provozu, je to bezpečné místo. Nepůsobí v něm radiace 
            a z nějakého důvodu do něj príliž nelezou TZ (aspoň zatím ne).
        </P>
        <P>
            Aby bunkr fungoval, musí v něm být hodnota zásob kyslíku větší než 0. Každý bunkr má omezení maximálních zásob 
            kyslíku a jeho vzduchotechnika kyslík obnovuje určitou rychlostí. No a je pochopitelné, že čím více je v bunkru
            lidí, tím rychleji kyslík ubývá. V momentě, kdy v bunkru žádný kyslík není, musí všechny osoby bunkr opustit.
        </P>
        
        <div className="grid">
        { bunkers.map(bunker => {
            if (bunker.isDestroyed) {
                return (
                    <BunkerCard
                        key={bunker.name}
                        style={{color: 'red', height: '300px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column'}}>
                        <P>==== Bunkr znicen ====</P>
                        <P>{bunker.name} ({bunker.id})</P>
                        <P>==== Bunkr znicen ====</P>
                    </BunkerCard>
                )   
            }
            return (
                <BunkerCard key={bunker.name}>
                    <P>{bunker.name} ({bunker.id})</P>
                    <P>Stav:</P>
                    {
                        getTimeToZero(bunker) > 10
                        ?
                        (<span style={{color: 'green'}}>OK</span>)
                        :
                        (<span style={{ color: 'orange'}}>Pozor, brzy nastane havarie!</span>)
                    }
                    <P>---</P>
                    <P>osoby v bunkru: {bunker.numberOfUsers}</P>
                    <P>---</P>
                    <P>kyslik: {bunker.oxygen.toFixed(2)}/{bunker.oxygenCap.toFixed(2)}</P>
                    <P>spotreba kysliku: { countConsumption(bunker).toFixed(2) } / minuta</P>
                    <P>generator kysliku: { bunker.oxygenGeneration.toFixed(2) }/minuta</P>
                    <P>
                        {
                            countConsumption(bunker) > bunker.oxygenGeneration ?
                                `zbyvajici cas ${getTimeToZero(bunker).toFixed(0)} minut`
                                :
                                `cas do doplneni kysliku ${getTimeToFull(bunker).toFixed(0)} minut` 
                        }
                    </P>
                    <P>---</P>
                    <button type="button" onClick={() => enterBunker(bunker)}>vstoupit</button>
                    {
                        bunker.numberOfUsers > 0 && <button type="button" onClick={() => leaveBunker(bunker)}>odejit</button>

                    }
                    
                </BunkerCard>
            )
        })}
        </div>
        </div>
    )
}

export default Zone;