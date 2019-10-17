import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import styled from 'styled-components';

import { H, P, Link, Input, SectionDivider } from '..';
import * as CONF from '../../config';

const Team = styled.div`
    display: flex;
    flex-direction: row;    
`;

const CharacterWrapper = styled.div`
    text-align: center;
    background-color: ${props => props.isSelected ? 'gray' : 'white'};
    margin: 5px 0 5px 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    min-height: 330px;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const Character = ({ character, isSelected, showName, teams }) => {
    if (!character) {
        return <div>Character nezvolen</div>
    }
    return (
        <CharacterWrapper isSelected={isSelected}>
            <div style={{ textAlign: 'left', flex: '2 1 220px' }}>
                { showName !== false && <div style={{ fontWeight: 'bold' }}>{character.name} </div>}
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
            <div style={{ flex: '1 1 220px' }}>
                <img src={`./data/characters/${character.img}`} width="200px" alt="avatar"/>
                <div style={{ fontSize: '8pt'}}><i>{character.trivia}</i></div>
            </div>
        </CharacterWrapper>
    )
}

 // eslint-disable-next-line
const CharacterPicker = ({ characters, onChange, roleDraft }) => {
    const { characterId } = roleDraft;

    const next = () => {
        const currentIndex = characters.findIndex(c => c.id === characterId) || 0;
        if (currentIndex < characters.length -1) {
            return onChange(characters[currentIndex + 1].id)
        }
        return onChange(characters[0].id)
    }

    const prev = () => {
        const currentIndex = characters.findIndex(c => c.id === characterId) || 0;
        if (currentIndex > 0) {
            return onChange(characters[currentIndex - 1].id)
        }
        return onChange(characters[characters.length -1].id)
    }

    const char = characters.find(c => c.id === characterId) || characters[0] 

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link onClick={next}>predchozi</Link>
                <div>{char.name}</div>
                <Link onClick={prev}>dalsi</Link>
            </div>
            
            <Character character={char} showName={false} />    
        </div>
    )
}

const Profile = ({ user, characters, role, roles, teams }) => {
    
    const [editMode, setEditMode] = useState(false);
    const [roleDraft, setRoleDraft] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        setRoleDraft(role);
    }, [role])

    const updateRole = (override) => {
        console.warn('update role called', override, roleDraft);
        return firebase.firestore().collection("users")
            .doc(user.uid)
            .set(override ? override : roleDraft)
        .catch(function(error) {
            setError(error.message);
        });
    }

    const signOut = () => {
        firebase.auth().signOut();
    }

    const getChar = (roleId) => {
        if (characters.length && role && role.characterId) {
            if (roleId) {
                return characters.find(ch => ch.id === roleId)
            }
            return characters.find(ch => ch.id === role.characterId)
        }
    }

    const getTeam = () => {
        if (teams.length && role && role.TeamId) {
            return teams.find(t => t.id === role.TeamId);
        }
    }

    const getTeamOptionLabel = (team) => {
        const members = roles.filter(r => r.TeamId === team.id);
        return `(${members.length}) ${team.name} ${team.note ? '('+team.note+')' : ''}`
    }

    const getRoleTypeCount = (roleType) => {
        return roles.filter(r => r.roleType === roleType).length
    }

    const getRemainingRoleTypeCount = (roleType) => {
        const count = getRoleTypeCount(roleType);
        if (roleType === 'divoky') {
            return CONF.DIVOCI_MAX_COUNT - count;
        }
        if (roleType === 'pruzkumnik') {
            return CONF.PRUZKUMNICI_MAX_COUNT - count;
        }
    }

    const isRoleTypeOptionDisabled = (roleType) => {
        return getRoleTypeCount('divoky') > CONF.DIVOCI_MAX_COUNT && roleType === 'divoky'
    }



    
    if (error) {
        return <P>Error: {error}</P>
    }


    return (
        <>
            <H>Vitej v systemu</H>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link onClick={signOut}>odhlasit</Link>
            
            {/* <Link onClick={() => setIsGameView(true)}>osobni dozimetr</Link> */}

            { !editMode && <Link onClick={() => setEditMode(true)}>editovat</Link>}
            { editMode && <Link onClick={() => updateRole().then(() => setEditMode(false))}>ulozit</Link>}
            </div>
            

            <br />

            <P>UID: {user.uid}</P>
            <P>Email: {user.email}</P>
            ---
            {
                editMode && role && (
                    <>
                    <SectionDivider>Osobni info</SectionDivider>
                    <Input 
                        label="Skutecne jmeno"
                        type="text"
                        value={roleDraft.name || ''}
                        onChange={(event => setRoleDraft({ ...roleDraft, name: event.target.value}))}
                    />

                    <Input 
                        label="Telefon"
                        type="text"
                        value={roleDraft.tel || ''}
                        onChange={(event => setRoleDraft({ ...roleDraft, tel: event.target.value}))}
                    />
                    
                    <SectionDivider>Dotaznik</SectionDivider>
                    <Input
                        label="Mam mobil s internetem / jsem schopny si poridit"
                        type="checkbox"
                        value={roleDraft.hasInternet}
                        onChange={() => setRoleDraft({...roleDraft, hasInternet: !roleDraft.hasInternet})}
                    /> 

                    {
                        roleDraft.hasInternet && (
                            <Input
                                label="Mam Android / iPhone"
                                type="select"
                                value={role.phoneType}
                                options={[{ value: 'iphone', label: 'iPhone'}, {value: 'android', label: 'android'}]}
                                onChange={(selected) => setRoleDraft({...roleDraft, phoneType: selected.value})}
                            /> 
                        )
                    }
                    
                   
                    <SectionDivider>Strana</SectionDivider>
                    
                    <Input
                        label="Pruzkumnik / Divoky"
                        type="select"
                        value={role.roleType}
                        options={[
                            { value: 'pruzkumnik', label: `pruzkumnik (zbyva ${getRemainingRoleTypeCount('pruzkumnik')})`},
                            {value: 'divoky', label: `divoky (zbyva ${getRemainingRoleTypeCount('divoky')})`}
                        ]}
                        isOptionDisabled={option => isRoleTypeOptionDisabled(option.value)}
                        
                        onChange={(selected) => {
                            updateRole({
                                ...roleDraft,
                                characterId: selected.value === 'pruzkumnik' ? characters[0].id: '',
                                TeamId: selected.value === 'pruzkumnik' ? roleDraft.TeamId : '',
                                roleType: selected.value});
                        }}
                    />


                    {
                        role.roleType === 'pruzkumnik' && (
                            <>
                            <SectionDivider>Postava</SectionDivider>

                            <CharacterPicker
                                onChange={(characterId) => setRoleDraft({ ...roleDraft, characterId })}
                                characters={characters}
                                roleDraft={roleDraft} />
                            </>
                        )
                    }

                    {
                        role.roleType === 'pruzkumnik' && (
                            <>
                            <SectionDivider>Team</SectionDivider>

                            <Input 
                                label="Team"
                                type="select"
                                options={teams.map(t => ({ label: getTeamOptionLabel(t) , value: t.id }))}
                                value={getTeam()? getTeam().id : 'Nezvolen'}
                                isOptionDisabled={option => roles.filter(r => r.TeamId === option.id).length > CONF.TEAM_MAX_COUNT}
                                onChange={(selected) => setRoleDraft({...roleDraft, TeamId: selected.value})}
                            />
                            </>
                        )
                    }

                    
                    <br />
                    </>
                )
            }

            {
                !editMode && role &&  (
                    <>
                        <SectionDivider>Osobni info</SectionDivider>

                        <P>Jmeno: {role.name}</P>
                        <P>Telefon: {role.tel}</P>

                        <SectionDivider>Dotaznik</SectionDivider>
                        
                        <P>Mobil s internetem: {role.hasInternet ? 'Ano': 'Ne'}</P>
                        { role.hasInternet && <P>Platforma: {role.phoneType}</P> }


                        {
                            role.roleType === 'pruzkumnik' && (
                                <SectionDivider>Team</SectionDivider>
                            )
                        }

                        {
                            role.roleType === 'pruzkumnik' && getTeam() && (
                                <Team>
                                <div style={{ flex: 1}}>
                                    <P>{getTeam().name.toUpperCase()}</P>
                                </div>
                                <div style={{ flex: 2}}>
                                <P>Clenove:</P>
                                { roles.filter(r => r.TeamId === role.TeamId).map(r => (
                                    <div key={r.id}>{r.name}</div>
                                ))}
                                </div>
                                <div style={{ flex: 2 }}>
                                <P>Role:</P>
                                    { roles.filter(r => r.TeamId === role.TeamId).map(r => (
                                        <div key={`${r.id}-character`}>{getChar(r.characterId) ? getChar(r.characterId).name : '---'}</div>
                                    ))}
                                </div>
                                </Team>
                            ) 
                        }

                        {
                            role.roleType === 'pruzkumnik' && !getTeam() && (
                                <P>Team nezvolen</P>
                            ) 
                        }

                        <SectionDivider>Strana</SectionDivider>
                        {
                            role.roleType ? role.roleType : 'Nezvoleno'
                        }
                        {
                            role.roleType === 'pruzkumnik' && (
                                <>
                                <SectionDivider>Postava</SectionDivider>
                                <Character character={getChar()} />
                                </>
                            )
                        }

                        <SectionDivider>Propozice</SectionDivider>
                        {
                            role.roleType === 'pruzkumnik' && (
                                <>
                                <P>Propozice, kde budes zacinat se vazi k teamu, takze taky budou zverejneny pozdeji.</P>
                                </>
                            )
                        }

                        {
                            role.roleType === 'divoky' && (
                                <>
                                <P>Na divoke nepusobi radiace, zijou v zone a prahnou po krvi. Zacinaji v tabore divokych v zone.</P>
                                </>
                            )
                        }

                        <br />
                        <br />
                        <br />
                    </>
                )
            }
            <br/>
            <i>* tvoje osobni udaje jsou analyzovany pokrocilymi algoritmy a jsou zcela jiste zpracovany v rozporu s nejakym zakonem </i>
        </>
    )
}

export default Profile;