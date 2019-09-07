import React, { useState, useEffect } from 'react';
import firebase from 'firebase';

import { H, P } from '../../components';

const Profile = ({ user }) => {
    const [role, setRole] = useState(null);
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);
    const [roleDraft, setRoleDraft] = useState(null);
    const [editMode, setEditMode] = useState(false);
    
    const updateRole = () => {
        firebase.firestore().collection("users").doc(user.uid).set(roleDraft)
        .catch(function(error) {
            setError(error.message);
        }).finally(() => setEditMode(false));
    }

    const signOut = () => {
        firebase.auth().signOut();
    }

    useEffect(() => {
        const getRole = () => {
            firebase.firestore().collection("users").doc(user.uid).onSnapshot(doc => {
                setRole(doc.data());
                setRoleDraft(doc.data());
            });
        };
        
        const getTeams = () => {
            const newTeams = [];
            firebase.firestore().collection("teams").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    newTeams.push({ id: doc.id,...doc.data()});
                });
                setTeams(newTeams);
            });
        };

        getRole();
        getTeams();
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
                    <P>Jmeno:</P>
                    <input type="text" value={roleDraft.name} onChange={(event => setRoleDraft({ ...roleDraft, name: event.target.value}))} />
                    
                    <P>Team:</P>
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
                    </select>
                    <br />
                    <button type="button" onClick={updateRole}>ulozit</button>
                    </>
                )
            }

            {
                !editMode && role &&  (
                    <>
                        <P>Jmeno: {role.name}</P>
                        <P>Team: {role.TeamId && teams.length ? teams.find(team => team.id === role.TeamId).name : 'team neprirazen'}</P>
                        
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