import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import QRCode from 'qrcode.react';
import styled from 'styled-components';

const A4 = styled.div`
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 4%;
    padding-right: 4%;
    margin: 0;
    @media print {
        width: 210mm;
        max-width: 210mm;
        height: 297mm;
        max-height: 297mm;
    }
`;

const SIZE=400;

const App = () => {
    const [roles, setRoles] = useState([]);
    const [teams, setTeams] = useState([]);
    // const [game, setGame] = useState(null);
    const [bunkers, setBunkers] = useState([]); 
    // const [characters, setCharacters] = useState([]);

    useEffect(() => {
        const db = firebase.firestore();
        // const getCharacters = async () => {
        //     try {
        //         const response = await fetch('./data/characters.json');
        //         if (!response.ok) {
        //             // would be nice to handle error but meh..
        //             return
        //         }
        //         const json = await response.json();
        //         setCharacters(json);
        //     } catch (err) {
        //         // mehh...
        //     }
        // }
        const getRoles = () => {
            db.collection('users').onSnapshot(function(querySnapshot) {
                const updatedRoles = [];
                querySnapshot.forEach(function(doc) {
                    updatedRoles.push({ id: doc.id, ...doc.data()});
                });
                setRoles(updatedRoles);
            }, (error) => {
                console.log('getRolesError', error)
            });
        }
        // const getGame = () => {
        //     db
        //     .collection("game")
        //     .doc("operacexxx")
        //     .onSnapshot(function(doc) {
        //         setGame(doc.data());
        //     });
        // }
        const getBunkers = () => {
            db.collection("bunkers").onSnapshot(function(querySnapshot) {
                const newBunkers = [];
                querySnapshot.forEach(function(doc) {
                    newBunkers.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setBunkers(newBunkers);
            });
        }
        const getTeams = () => {
            const newTeams = [];
            firebase.firestore().collection("teams").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    newTeams.push({ id: doc.id,...doc.data()});
                });
                setTeams(newTeams);
            });
        };

        getTeams();
        // getGame();
        getBunkers();
        getRoles();   
        // getCharacters();
    }, [])

    return (
    <>
        <A4>
        <h1>QR kody</h1>
    </A4>

    {bunkers.map(b => {
        return (
            <A4>
                <h2>{b.name}</h2>
                <QRCode size={SIZE} value={`bunker:${b.id}`} />
            </A4>
        )
        })}

        <A4>
            <h2>Posledni mistnost ve svatyni</h2>
            <QRCode size={SIZE} value="last-door" />
        </A4>

        <A4>
            <h2>Prazdna mistnost (past divokych)</h2>
        </A4>
        <A4>
            <h2>Prazdna mistnost</h2>
            <QRCode size={SIZE} value="trap" />
        </A4>

        <A4>
        <h1>Teamy</h1>
        {teams.length && roles.length && teams.reduce((data, team) => {
            const teamWithRoles = team;
            teamWithRoles.roles = [];
            roles.forEach(role => {
                if (role.TeamId === team.id) {
                    teamWithRoles.roles.push(role);
                }
            });
            return [ ...data, teamWithRoles ];
        },[]).map(t => (
            <>
            <h2>{t.name}</h2>
            <table>
            {

                t.roles.map(r => (
                    <>
                        <tr>
                        <td>{r.name}</td>
                        <td>{r.characterId}</td>
                        <td>{r.tel}</td>
                        </tr>
                    </>
                ))
            }
            </table>

            </>

        ))
        }
        </A4>
    </>
    )
}

export default App;