import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import styled from 'styled-components';

import { H, P, Link, Input } from '..';
import { Label } from '../Input';

const CharacterWrapper = styled.div`
    cursor: pointer;
    background-color: ${props => props.isSelected ? 'gray' : 'white'};
`;

const Character = ({ character, isSelected, onClick }) => {
    return (
        <CharacterWrapper isSelected={isSelected} onClick={onClick}>
            <div>{character.name} </div>
            <div>{character.description}</div>
        </CharacterWrapper>
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
                    <Input 
                        label="Jmeno"
                        type="text"
                        value={roleDraft.name}
                        onChange={(event => setRoleDraft({ ...roleDraft, name: event.target.value}))}
                    />
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
                    <Label>Zvol si postavu</Label>
                    {
                        characters.map(( char ) => (
                            <Character
                                character={char}
                                isSelected={role && role.characterId === char.id}
                                key={char.id}
                                onClick={() => { 
                                    setRoleDraft({...roleDraft, characterId: char.id });
                                    updateRole();
                                }}
                            />
                        ))
                    }
                    <br />
                    <Link onClick={() => updateRole().then(() => setEditMode(false))}>ulozit</Link>
                    </>
                )
            }

            {
                !editMode && role &&  (
                    <>
                        <P>Jmeno: {role.name}</P>
                        {/* <P>Team: {role.TeamId && teams.length ? teams.find(team => team.id === role.TeamId).name : 'team neprirazen'}</P> */}
                        <P>Mobil s internetem: {role.hasInternet ? 'Ano': 'Ne'}</P>
                        { role.hasInternet && <P>Platforma: {role.phoneType}</P> }
                        { getChar() && <P>Role: {getChar().name}</P> }
                        <Label>Role: </Label>
                        { getChar() && (
                            <>
                            <P>{getChar().name}</P>
                            <P>{getChar().description}</P>
                            <P>Povolene vybaveni: {getChar().equipment.map((eq) => (<span key={eq}>{eq}{', '} </span>))}</P>
                            <P><i>{getChar().trivia}</i></P>
                            <img src={`./data/characters/${getChar().img}`} width="300" alt="avatar"/>
                            </>
                        )}
                        {
                            !getChar() && 'Nezvolena'
                        }
                        <br />
                        <Link onClick={() => setEditMode(true)}>editovat</Link>
                    </>
                )
            }
            <br/>
        </>
    )
}

export default Profile;