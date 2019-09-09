import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import styled from 'styled-components';

import { H, P, Input } from '../../components';
import { Label } from '../../components/Input';

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
const Profile = ({ user }) => {
    const [role, setRole] = useState(null);
    // const [teams, setTeams] = useState([]);
    const [characters, setCharacters] = useState([]);
    
    const [error, setError] = useState(null);
    const [roleDraft, setRoleDraft] = useState(null);
    const [editMode, setEditMode] = useState(false);

    
    const updateRole = () => {
        console.log('update', roleDraft);
        firebase.firestore().collection("users").doc(user.uid).set(roleDraft)
        .catch(function(error) {
            setError(error.message);
        }).finally(() => setEditMode(false));
    }

    const signOut = () => {
        firebase.auth().signOut();
    }

    useEffect(() => {
        const getCharacters = async () => {
            try {
                const response = await fetch('./data/characters.json');
                if (!response.ok) {
                    // would be nice to handle error but meh..
                    return
                }
                const json = await response.json();
                setCharacters(json);
            } catch (err) {
                // mehh...
            }
        }
        getCharacters();

    }, [])

    useEffect(() => {
        const getRole = () => {
            firebase.firestore().collection("users").doc(user.uid).onSnapshot(doc => {
                setRole(doc.data());
                setRoleDraft(doc.data());
            });
        };
        
        // const getTeams = () => {
        //     const newTeams = [];
        //     firebase.firestore().collection("teams").get().then(function(querySnapshot) {
        //         querySnapshot.forEach(function(doc) {
        //             newTeams.push({ id: doc.id,...doc.data()});
        //         });
        //         setTeams(newTeams);
        //     });
        // };

        getRole();
        // getTeams();
    }, [user])

    if (error) {
        return <P>Error: {error}</P>
    }


    return (
        <>
            <H>Vitej v systemu</H>
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
                                onClick={() => setRoleDraft({...roleDraft, characterId: char.id })}
                            />
                        ))
                    }
                    <br />
                    <button type="button" onClick={updateRole}>ulozit</button>
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
                        { role.characterId && <P>Role: {characters.find(ch => ch.id === role.characterId).name }</P> }
                        <br />
                        <button type="button" onClick={() => setEditMode(true)}>editovat</button>
                    </>
                )
            }
            <br/>
            <button type="button" onClick={signOut}>odhlasit</button>
        </>
    )
}

export default Profile;