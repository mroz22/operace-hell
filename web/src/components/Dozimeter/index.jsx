/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';

import { Wrapper, Option, Options, SectionDropwdown, Description, Input } from '../../components';
import QRCode from 'qrcode.react';
import QrReader from 'react-qr-reader'
import { 
    Bunker as BunkerSituation,
    SecretChamber,
    Trap,
    Role,
} from '../Situation';
import Bunker from '../Zone/bunker';
import * as CONF from '../../config'
import { getDoseInfo } from '../../utils/radiation';

const Dozimeter = (props) => {
    const { game, role, bunkers, user, roles, characters, teams } = props;

    const [qr, setQr] = useState({ type: undefined, value: undefined });
    const [qrReaderOpened, setQrReaderOpened] = useState(false);

    const character = characters.find(c => c.id === role.characterId);
    const team = teams.find(t => t.id === role.TeamId);

    useEffect(() => {
        const updateGeo = (uid, lat, lng) => {
            if (!uid || !lat || !lng) return;
            db.collection('users').doc(uid).update({
                "geo.lat": lat,
                "geo.lng": lng,
            });
        }
        let interval;
        if (navigator.geolocation) {
            interval = setInterval(() => {
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

        return () => {
            clearInterval(interval);
        }
    }, [role.uid])

    if (!game || !role || !role.status || !bunkers || !user || !roles || !characters) {
        return 'loading...'
    }

    const currentBunker = bunkers.find(b => b.id === role.status.BunkerId);

    const updateUser = (data) => {
        return db.collection("users")
            .doc(user.uid)
            .update({
                ...data,
            });
    }
    const enterBunker = (BunkerId) => {
        return updateUser({ 'status.BunkerId': BunkerId })
    }

    const enterSecretChamber = () => {
        return updateUser({ 'status.hasEnteredSecretChamber': true })
    }

    const parseQr = (value) => {
        const delimiterIndex = value.indexOf(':');
        if (delimiterIndex === -1) {
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
    
    const onSituationCancel = () => {
        setQr({ type: undefined, value: undefined})
    }

    const onEnterBunker = async (BunkerId) => {
        await enterBunker(BunkerId);
        onSituationCancel();
    }

    const onEnterSecretChamber = async () => {
        await enterSecretChamber();
    }

    if (!team) {
        return <>nemas zvoleny team. to bysme nebyli kamaradi.</>
    }
    console.log(team);
    
    const survivorsLeft = game.MAX_SURVIVORS - roles.filter(r => r.status && r.status.enteredCorrectPassword ).length
    if (role.status.enteredCorrectPassword) {
        return (
            <Wrapper>
                <Description>
                    Podarilo se ti splnit cil hry, vstoupil jsi do uzamceneho bunkru X! Jeste v nem stale zbyva
                    {' '}{survivorsLeft}{' '}mist.
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
                    survivorsLeft={survivorsLeft}
                />
            );
        case 'trap':
            return (
                <Trap
                    game={game}
                    role={role}
                    onSituationCancel={onSituationCancel}
                    onEnter={() => updateUser({ 'status.trappedUntilEpoch': game.epoch + 4 })}
                />
            );
        case 'role':
                const targetRole = roles.find(r => r.uid === qr.id)
                return (
                    <Role
                        character={characters.find(c => c.id === role.characterId )}
                        role={role}
                        targetRole={targetRole}
                        targetCharacter={characters.find(c => c.id === targetRole.characterId )}
                        onSituationCancel={onSituationCancel}
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

    const getStatusIcons = () => {
        const icons = [];
        if (game.radiation > 0) icons.push(' ☢ ');
        if (role.status.trappedUntilEpoch > game.epoch) icons.push(' ❕ ')
        return icons;
    }

    const getHealthIcons = () => {
        if (role.status.injury === 'light') return [' 💊 '];
        if (role.status.injury === 'heavy') return [' 💉 '];
        if (role.status.injury === 'lethal') return [' 💀 ']
    }

    return (
        <Wrapper>
            
            <Options>
                <Option onClick={() => setQrReaderOpened(!qrReaderOpened)}>Precist QR</Option>
                { currentBunker && <Option onClick={()=>enterBunker("")}>Odejit z bunkru</Option> }
            </Options>

            <SectionDropwdown
                icons={getStatusIcons()}
                title={
                    `Nachazis se ${currentBunker ? 'v bunkru' : 'pod sirym nebem'}`
                }>
                        {
                            currentBunker && <Bunker game={game} role={role} bunker={currentBunker} />
                        }
                        {
                            !currentBunker && (
                                <>
                                <div
                                    style={{ fontSize: '3em', textAlign: 'center', color: getDoseInfo(game.radiation).color }}>
                                        ☢{' '}{game.radiation.toFixed(2)} mSv/H
                                </div>
                                <div style={{textAlign: 'center'}}>{getDoseInfo(game.radiation).text}</div>
                                </>
                            )
                        }
                        { role.status.trappedUntilEpoch > game.epoch && (
                            <div>Jsi v pasti. Vysvobodis se za {role.status.trappedUntilEpoch - game.epoch} epoch</div>
                        )}
            </SectionDropwdown>

            <SectionDropwdown title="Postava">
                {
                    character && (
                        <>
                        <div style={{ textAlign: 'left', flex: '2 1 220px' }}>
                        <div style={{ fontWeight: 'bold' }}>{character.name} </div>
                        <div>{character.description}</div>
                        <div>Nezbytne vybaveni:</div> 
                        <ul>
                            {character.equipment.map((eq) => (<li key={eq}>{eq}{', '} </li>))}
                        </ul>
                        <div>Zvlastni dovednosti:</div>
                        <ul>
                        {character.skills.map((sk) => (<li key={sk.name}>{sk.name}: {sk.description}{', '} </li>))}
                        </ul>
                        <div>
                        Munice: 
                        { character.ammo === 'no' && '0' }
                        { character.ammo === 'low' && CONF.LOW_AMMO }
                        { character.ammo === 'medium' && CONF.MEDIUM_AMMO }
                        { character.ammo === 'high' && CONF.HIGH_AMMO }
                        </div>
                        </div>
                        </>
                    )
                }
            </SectionDropwdown>
                    <SectionDropwdown title="Vybaveni">
                        <Input type="checkbox" label="radiacni oblek" value={role.status.protectiveSuiteOn} onChange={() => {
                            updateUser({ 'status.protectiveSuiteOn': !role.status.protectiveSuiteOn })
                        }} />
                    </SectionDropwdown>
                    <SectionDropwdown title="Mutace" icons={' 🐙 '.repeat(role.status.mutations.length)}>
                        { !role.status.mutations.length && (
                            'Zatim nemas zadnou mutaci. Ale pozor, cim vice se budes vystavovat radiaci bez ochrany, roste sance, ze tvuj organismus zmutuje. To bude mit za nasledek zmenu tvych telesnych nebo dusevnich vlastnosti.'
                        )} 
                        { role.status.mutations && role.status.mutations.map(m => (
                            <div key={m.id}>
                            <div style={{ textDecoration: 'underline' }}>{m.name}</div>
                            <div>{m.description}</div>
                            </div>
                        ))}
                    </SectionDropwdown>

                    <SectionDropwdown title="Zdravotni stav" icons={getHealthIcons()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                            <div style={{ display: 'flex', flexDirection: 'column'}}>
                                <Input
                                    type="checkbox"
                                    value={role.status.injury === 'none'}
                                    onChange={() => updateUser({'status.injury': 'none'})}
                                    label="Nezranen" />
                                <Input
                                    type="checkbox"
                                    value={role.status.injury === 'light'}
                                    label="Lehce zranen"
                                    onChange={() => updateUser({'status.injury': 'light'})}
                                    />
                                <Input
                                    type="checkbox"
                                    value={role.status.injury === 'heavy'}
                                    label="Tezce zranen"
                                    onChange={() => updateUser({'status.injury': 'heavy'})}
                                />
                                <Input 
                                    type="checkbox"
                                    value={role.status.injury === 'lethal'}
                                    label="Mrtev"
                                    onChange={() => updateUser({'status.injury': 'lethal'})}
                                />
                            </div>
                            { role.uid && <div style={{ backgroundColor: 'white', padding: '15px'}}><QRCode value={`role:${role.uid}`} /></div> }
                        </div>
                        { role.status.permanentInjuries && role.status.permanentInjuries.map(m => (
                            <div key={m.id}>
                            <div style={{ textDecoration: 'underline' }}>{m.name}</div>
                            <div>{m.description}</div>
                            </div>
                        ))}
                    </SectionDropwdown>
                    
                    <SectionDropwdown title="Ukol">
                            <ul>
                                <li>
                                22.10 ve 22.00 bud na <a href={team.start} target="_blank">tomto miste</a> i s celym svym teamem. Odtud zahajte postup smerem do Zony.  
                                </li>
                                <li>
                                Co nejdrive najdete bunkr s fungujici podporou zivota.
                                Budete ho potrebovat v pripade, ze v Zone stoupne radiace.
                                </li>
                                <li>
                                Zjistete co se nachazi v tajne svatyni Divokych uprostred Zony.
                                </li>
                            </ul>

                            
                    </SectionDropwdown>
                    <Description style={{ alignSelf: 'center', marginTop: 'auto', textAlign: 'center' }}>
                        Epoch do kolapsu zony: {game.END_EPOCH - game.epoch}
                    </Description>
        </Wrapper>
    )    
}

export default Dozimeter