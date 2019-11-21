import React, { useState, useEffect } from 'react';
// import * as firebase from 'firebase';
import { firebase, db } from './firebase';

import Preloader from './components/Preloader';
import Info from './views/Info'
import Profile from './views/Profile';

const App = () => {
    const [ user, setUser ] = useState(null);

    const [role, setRole] = useState({});
    const [roles, setRoles] = useState([]);
    const [teams, setTeams] = useState([]);
    const [game, setGame] = useState(null);
    const [bunkers, setBunkers] = useState([]); 
    const [characters, setCharacters] = useState([]);
    const [isProfileView, setIsProfileView] = useState(false);

    useEffect(() => {

        // set auth;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                setUser(user);
                setIsProfileView(true);
            } else {
                setUser(null);
                setIsProfileView(false);
            }
        }, function(error) {
            console.log('auth error', error);
        });

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
                console.error('err', err);
            }
        }


        const getRoles = () => {
            db.collection('users').onSnapshot(function(querySnapshot) {
                const updatedRoles = [];
                querySnapshot.forEach(function(doc) {
                    updatedRoles.push({ id: doc.id, ...doc.data()});
                });
                setRoles(updatedRoles);
                // console.log('updatedRoles', updatedRoles);
            }, (error) => {
                console.log('getRolesError', error)
            });
        }

        const getGame = () => {
            db
            .collection("game")
            .doc("operacexxx")
            .onSnapshot(function(doc) {
                console.log(doc.data());
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

    useEffect(() => {
        const db = firebase.firestore();

        const getRole = () => {
            if (!user) {
                return;
            }
            db.collection("users").doc(user.uid).onSnapshot(doc => {
                setRole({
                    uid: user.uid,
                    ...doc.data()
                });
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

    const getNumberOfUsersInBunker = (bunkerId) => {
        return roles.filter(r => {
            return r.status && r.status.BunkerId === bunkerId;
        }).length;
    }

    const getJoinedBunkers = () => {
        if (bunkers.length === 0) {
            return [];
        }
        const formatted = bunkers.map(b => {
            return {
                ...b,
                numberOfUsers: getNumberOfUsersInBunker(b.id),
            }
        })
        return formatted;
    }

    return (
        <Preloader>
            { !isProfileView && (
                <Info 
                    setIsProfileView={setIsProfileView}
                    roles={roles}
                    characters={characters}
                    user={user}
                    role={role}
                    game={game}
                    teams={teams}
                    bunkers={getJoinedBunkers()} />
            )}
            { isProfileView && (
                <Profile 
                    game={game}
                    setIsProfileView={setIsProfileView}
                    roles={roles}
                    user={user}
                    role={role}
                    characters={characters}
                    teams={teams} 
                    bunkers={getJoinedBunkers()} />
                )
            }
        </Preloader>
    )
}

export default App;