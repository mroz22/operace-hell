import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import styled from 'styled-components';

import { H, P, Link, Input, SectionDivider } from '..';

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

const Character = ({ character, isSelected, onClick, showName }) => {
    if (!character) {
        return <div>Character nezvolen</div>
    }
    return (
        <CharacterWrapper isSelected={isSelected} onClick={onClick}>
            <div style={{ textAlign: 'left', flex: '2 1 220px' }}>
                { showName !== false && <div style={{ fontWeight: 'bold' }}>{character.name} </div>}
                <div>{character.description}</div>
                <div>Nezbytne vybaveni:</div> 
                <ul>
                    {character.equipment.map((eq) => (<li key={eq}>{eq}{', '} </li>))}
                </ul>
            </div>
            <div style={{ flex: '1 1 220px' }}>
                <img src={`./data/characters/${character.img}`} width="200px" alt="avatar"/>
                <div style={{ fontSize: '8pt'}}><i>{character.trivia}</i></div>
            </div>
        </CharacterWrapper>
    )
}

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

const Profile = ({ user, characters, role }) => {
    
    const [editMode, setEditMode] = useState(false);
    const [roleDraft, setRoleDraft] = useState(null);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        setRoleDraft(role);
    }, [role])

    const updateRole = (override) => {
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

    const getChar = () => {
        if (characters.length && role && role.characterId) {
            return characters.find(ch => ch.id === role.characterId)
        }
    }

    if (error) {
        return <P>Error: {error}</P>
    }


    return (
        <>
            <H>Vitej v systemu</H>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link onClick={signOut}>odhlasit</Link>
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
                    

                    {/* <P>Team:</P>
                    <select     
                        onChange={(event) => {  
                            setRoleDraft({ ...roleDraft, TeamId: event.target.value})
                        }}>
                        { 
                            teams.sort((a, b) => {
                                if (role.TeamId) {
                                    if(role.TeamId > b.id) { return -1; }
                                    if(role.TeamId < a.id) { return 1; }
                                    return 0; 
                                }
                                return 0;
                            }).map((team) => {
                                return (<option value={team.id} key={team.id}>{team.name}</option>)
                            })
                        }
                    </select> */}
                    <SectionDivider>Postava</SectionDivider>
                    
                    <Input
                        label="Pruzkumnik / Divoky"
                        type="select"
                        value={role.roleType}
                        options={[{ value: 'pruzkumnik', label: 'pruzkumnik'}, {value: 'divoky', label: 'divoky'}]}
                        onChange={(selected) => {
                            // setRoleDraft({
                            //     ...roleDraft,
                            //     characterId: selected.value === 'pruzkumnik' ? characters[0].id: '',
                            //     roleType: selected.value});
                            updateRole({
                                ...roleDraft,
                                characterId: selected.value === 'pruzkumnik' ? characters[0].id: '',
                                roleType: selected.value});
                        }}
                    />

                    {
                        role.roleType === 'pruzkumnik' && (
                            <>
                            <CharacterPicker
                                onChange={(characterId) => setRoleDraft({ ...roleDraft, characterId })}
                                characters={characters}
                                roleDraft={roleDraft} />
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

                        {/* <P>Team: {role.TeamId && teams.length ? teams.find(team => team.id === role.TeamId).name : 'team neprirazen'}</P> */}
                        <SectionDivider>Dotaznik</SectionDivider>
                        
                        <P>Mobil s internetem: {role.hasInternet ? 'Ano': 'Ne'}</P>
                        { role.hasInternet && <P>Platforma: {role.phoneType}</P> }


                        <SectionDivider>Postava</SectionDivider>
                        {
                            role.roleType === 'pruzkumnik' ? <Character character={getChar()} />: 'Divoky' 
                        }

                        <SectionDivider>Propozice</SectionDivider>
                        {
                            role.roleType === 'pruzkumnik' && (
                                <>
                                <P>Nyni probiha predbezna registrace. Prirazovani do teamu bude zpristupneno pozdeji.</P>
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