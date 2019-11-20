import React from 'react';

import { H, P } from '../../components';
import Bunker from './bunker';

const Zone = ({ user, role, roles, game, bunkers }) => {
  
    return (
        <div>
        <H>Zóna</H>
        <P>
            V Zóně působí radiace, jejíž aktuální úroveň je {game ? `${game.radiation.toFixed(2)}` : '?'}.
            Úroveň radiace je kolísavá. O její aktuální síle bude pruzkumniky informovat osobní dozimetr (aplikace do smartfounu).
            Radiace téměř nepůsobí na osoby v ochranném obleku a je zcela odstíněná v bunkrech. Kumulované ozáření způsobuje mutace, o nichž bude pruzkumniky informovat jejich aplikace.
        </P>

        <H>Bunkry</H>
        <P>
            V zóně se nachází několik bunkrů. Dokud je bunkr v provozu, je to bezpečné místo. Nepůsobí v něm radiace 
            a z nějakého důvodu do něj prílis nelezou Divoci (aspoň zatím ne).
        </P>
        <P>
            Aby bunkr fungoval, musí v něm být hodnota zásob energie větší než 0. Každý bunkr má omezení maximálních zásob 
            energie a jeho generátor obnovuje energii určitou rychlostí. No a je pochopitelné, že čím více je v bunkru
            lidí, tím rychleji energie ubývá. V momentě, kdy bunkr žádnou energii nemá, přestává platit ochrana proti radiaci
            a přestává fungovat zámek na dveřích bunkru (bunkr je od této doby stále odemčen). Navic je bunkr navzdy znicen.
        </P>
        
        <div className="grid" style={{ flexWrap: 'wrap' }}>
        { bunkers.filter(b => b.name !== 'bily').map(bunker => {
            return <Bunker key={bunker.name} game={game} bunker={bunker} role={role} showQr/>
        })}
        </div>
        </div>
    )
}

export default Zone;