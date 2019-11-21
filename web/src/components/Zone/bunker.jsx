import React from 'react';
import QRCode from 'qrcode.react';

import { P } from '..';
import {countConsumption, getTimeToFull, getTimeToZero } from '../../utils/bunker';
import { getDoseInfo } from '../../utils/radiation';
import { GREEN } from '../../config';

const BunkerCard = ({ children, style }) => {
    return (<div className="col" style={{
        margin: '10px',
        padding: '10px',
        color: GREEN,
        backgroundColor: 'black',
        borderRadius: '3px',
        minWidth: '200px',
        ...style,
    }}>
        {children}
    </div>)
}

const Bunker = ({ game, bunker, role, showQr }) => {
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
            <P>{bunker.name}</P>
            <P>Stav:
            {
                getTimeToZero(bunker) > 10
                ?
                (<span style={{color: 'green'}}>OK</span>)
                :
                (<span style={{ color: 'orange'}}>Pozor, brzy nastane havarie!</span>)
            }
            </P>
            <P>
            zareni tam venku: <span style={{ color: getDoseInfo(game.radiation).color }}>
            { getDoseInfo(game.radiation).text }</span>
            </P>  
            <P>osoby v bunkru: {bunker.numberOfUsers}</P>
            <P>energie: {bunker.oxygen.toFixed(2)}/{bunker.oxygenCap.toFixed(2)}</P>
            <P>spotreba energie: { game.radiation > 0 ? `${countConsumption(bunker).toFixed(2)}/minuta`: '0 (podpora zivota neni nutna)' }</P>
            <P>generator energie: { bunker.oxygenGeneration.toFixed(2) } / minuta</P>
            <P>
                {
                    game.radiation > 0 && countConsumption(bunker) > bunker.oxygenGeneration ?
                        `zbyvajici cas ${getTimeToZero(bunker).toFixed(0)} minut`
                        :
                        `cas do plneho doplneni ${getTimeToFull(bunker).toFixed(0)} minut` 
                }
            </P>
            { 
                showQr && (
                    <>
                    <P>---</P>
                    <div style={{ backgroundColor: 'white', padding: '5px', maxWidth: '130px' }}>
                        <QRCode value={`bunker:${bunker.id}`} />
                    </div>
                    </>
                )
            }
            
        </BunkerCard>
    )
}

export default Bunker;