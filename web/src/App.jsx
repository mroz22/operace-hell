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


// function Icon() {
//   return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 225" style={{ position: 'absolute', opacity: 0.1 }}>
//       <path fill="#EEEBE4">
//                 <animate
//                         attributeName="d"
//                         dur="8s"
//                         repeatCount="indefinite"
//                         values="M123.63,4.78C58.88,12.27,34.28-11.9,13.02,15.7C-4.75,38.48-14.32,153.77,63.69,188.97
// 	c68.24,30.8,138.63-9.43,172.27-78.99C255.75,69.05,193.75-5.76,123.63,4.78z;

// M123.63,4.78C41.5,14.05,29.65-14.91,13.02,15.7C-7,52.55-6.32,204.81,63.69,188.97
// 	c74.81-16.92,143.01-7.48,172.27-78.99C252.5,69.55,212.5-8.45,123.63,4.78z;

//                        M123.63,4.78C41.5,14.05,16.11-16.94,13.02,15.7C3,121.55,0.78,223.54,63.69,188.97
// 	c86.31-47.42,155.03-3.67,172.27-78.99C247.5,59.55,219.5-17.95,123.63,4.78z;

// M123.63,4.78C41.5,14.05,29.65-14.91,13.02,15.7C-7,52.55-6.32,204.81,63.69,188.97
// 	c74.81-16.92,143.01-7.48,172.27-78.99C252.5,69.55,212.5-8.45,123.63,4.78z;
								
// 								M123.63,4.78C58.88,12.27,34.28-11.9,13.02,15.7C-4.75,38.48-14.32,153.77,63.69,188.97
// 	c68.24,30.8,138.63-9.43,172.27-78.99C255.75,69.05,193.75-5.76,123.63,4.78z;">
//                  </animate> </path>
//   </svg>;
// }

export default App;