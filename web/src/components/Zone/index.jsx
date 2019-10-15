import React from 'react';
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

const Zone = ({ user, role, roles, game, bunkers }) => {
    const db = firebase.firestore();

    const enterBunker = (bunker) => {
        db.collection("users")
            .doc(user.uid)
            .set({
                ...role,
                BunkerId: bunker.id,
            });
    }


    const leaveBunker = (bunker) => {
        db.collection("users")
            .doc(user.uid)
            .set({
                ...role,
                BunkerId: '',
            });
    }

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
            V Zóně působí radiace, jejíž aktuální úroveň je {game ? `${game.radiation.toFixed(2)}` : '?'}.
            Úroveň radiace je kolísavá. O její aktuální síle bude pruzkumniky informovat osobní dozimetr (aplikace do smartfounu).
            Radiace téměř nepůsobí na osoby v ochranném obleku a je zcela odstíněná v bunkrech. Kumulované ozáření způsobuje mutace,
            o nichž bude pruzkumniky informovat jejich aplikace.
        </P>

        <H>Bunkry</H>
        <P>
            V zóně se nachází několik bunkrů. Dokud je bunkr v provozu, je to bezpečné místo. Nepůsobí v něm radiace 
            a z nějakého důvodu do něj prílis nelezou TZ (aspoň zatím ne).
        </P>
        <P>
            Aby bunkr fungoval, musí v něm být hodnota zásob energie větší než 0. Každý bunkr má omezení maximálních zásob 
            energie a jeho generátor obnovuje energii určitou rychlostí. No a je pochopitelné, že čím více je v bunkru
            lidí, tím rychleji energie ubývá. V momentě, kdy bunkr žádnou energii nemá, přestává platit ochrana proti radiaci
            a přestává fungovat zámek na dveřích bunkru (bunkr je od této doby stále odemčen).
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
                    <P>energie: {bunker.oxygen.toFixed(2)}/{bunker.oxygenCap.toFixed(2)}</P>
                    <P>spotreba energie: { countConsumption(bunker).toFixed(2) } / minuta</P>
                    <P>generator energie: { bunker.oxygenGeneration.toFixed(2) } / minuta</P>
                    <P>
                        {
                            countConsumption(bunker) > bunker.oxygenGeneration ?
                                `zbyvajici cas ${getTimeToZero(bunker).toFixed(0)} minut`
                                :
                                `cas do plneho doplneni ${getTimeToFull(bunker).toFixed(0)} minut` 
                        }
                    </P>
                    <P>---</P>
                    
                    {
                        role && (
                            <>
                                {
                                    !role.BunkerId && (
                                        <button type="button" onClick={() => enterBunker(bunker)}>vstoupit</button>
                                    )
                                }

                                {
                                    role.BunkerId && bunker.id === role.BunkerId && (
                                        <button type="button" onClick={() => leaveBunker(bunker)}>odejit</button>
                                    )
                                }
                            </>
                        )
                    }
                    
                </BunkerCard>
            )
        })}
        </div>
        </div>
    )
}

export default Zone;