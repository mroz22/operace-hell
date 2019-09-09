import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';

import Preloader from './components/Preloader';
import Info from './views/Info'
import Profile from './views/Profile';


const App = () => {

    const [ user, setUser ] = useState(null);

    const [role, setRole] = useState(null);
    // const [teams, setTeams] = useState([]);

    const [characters, setCharacters] = useState([]);

    const [isProfileView, setIsProfileView] = useState(false);
    
    useEffect(() => {
        // set auth;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
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
                // mehh...
            }
        }
        getCharacters();
    }, [])

    useEffect(() => {
        console.log(user);
        if (!user) {
            return;
        }
        const getRole = () => {
            firebase.firestore().collection("users").doc(user.uid).onSnapshot(doc => {
                setRole(doc.data());
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

    

    return (
        <Preloader>
            { !isProfileView && <Info setIsProfileView={setIsProfileView} />}
            { isProfileView && <Profile setIsProfileView={setIsProfileView} user={user} role={role} characters={characters} /> }
            
        
        </Preloader>
    )
}

export default App;