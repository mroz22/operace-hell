import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import styled from 'styled-components';

import { H, P, Link, Input, SectionDivider } from '..';

const CharacterWrapper = styled.div`
    text-align: center;
    background-color: ${props => props.isSelected ? 'gray' : 'white'};
    margin: 5px 0 5px 0;
`;

const Character = ({ character, isSelected, onClick, showName }) => {
    if (!character) {
        return <div>Character nezvolen</div>
    }
    return (
        <CharacterWrapper isSelected={isSelected} onClick={onClick}>
            { showName !== false && <div>{character.name} </div>}
            <div>{character.description}</div>
            <div>Povolene vybaveni: {character.equipment.map((eq) => (<span key={eq}>{eq}{', '} </span>))}</div>
            <img src={`./data/characters/${character.img}`} width="200" alt="avatar"/>
            <div><i>{character.trivia}</i></div>
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
                <div>{characters.find(c => c.id === characterId).name}</div>
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

    const updateRole = () => {
        return firebase.firestore().collection("users")
            .doc(user.uid)
            .set(roleDraft)
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
            <Link onClick={signOut}>odhlasit</Link>
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
                        value={roleDraft.name}
                        onChange={(event => setRoleDraft({ ...roleDraft, name: event.target.value}))}
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
                    <CharacterPicker
                        onChange={(characterId) => setRoleDraft({ ...roleDraft, characterId })}
                        characters={characters}
                        roleDraft={roleDraft} />
                    <br />
                    <Link onClick={() => updateRole().then(() => setEditMode(false))}>ulozit</Link>
                    </>
                )
            }

            {
                !editMode && role &&  (
                    <>
                        <SectionDivider>Osobni info</SectionDivider>

                        <P>Jmeno: {role.name}</P>
                        {/* <P>Team: {role.TeamId && teams.length ? teams.find(team => team.id === role.TeamId).name : 'team neprirazen'}</P> */}
                        <SectionDivider>Dotaznik</SectionDivider>
                        
                        <P>Mobil s internetem: {role.hasInternet ? 'Ano': 'Ne'}</P>
                        { role.hasInternet && <P>Platforma: {role.phoneType}</P> }

                        <SectionDivider>Postava</SectionDivider>
                        <Character character={getChar()} />
                        <br />
                        <Link onClick={() => setEditMode(true)}>editovat</Link>
                    </>
                )
            }
            <br/>
            <i>* tvoje osobni udaje jsou analyzovany pokrocilymi algoritmy a jsou zcela jiste zpracovany v rozporu s nejakym zakonem </i>
        </>
    )
}

export default Profile;