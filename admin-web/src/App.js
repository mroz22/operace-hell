import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import QRCode from 'qrcode.react';
import styled from 'styled-components';

const A4 = styled.div`
    width: 210mm;
    height: 297mm;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const SIZE=400;

const App = () => {
    const [roles, setRoles] = useState([]);
    const [teams, setTeams] = useState([]);
    const [game, setGame] = useState(null);
    const [bunkers, setBunkers] = useState([]); 
    const [characters, setCharacters] = useState([]);
  
    useEffect(() => {
        const db = firebase.firestore();
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
        const getGame = () => {
            db
            .collection("game")
            .doc("operacexxx")
            .onSnapshot(function(doc) {
                setGame(doc.data());
            });
        }
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
        getGame();
        getBunkers();
        getRoles();   
        getCharacters();
    }, [])

    return (
      <>
      <A4>
        <h1>Bunkry</h1>
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
        <h2>Tajna svatyne divokych</h2>
        <QRCode size={SIZE} value="secret-chamber " />
      </A4>
      </>
    )
}

export default App;