import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase';

import { H, P } from '../../components';

const Users = () => {
    const [roles, setRoles] = useState([]);

    const db = firebase.firestore();

    useEffect(() => {
        const getRoles = () => {
            db.collection('users').onSnapshot(function(querySnapshot) {
                const updatedRoles = [];
                querySnapshot.forEach(function(doc) {
                    updatedRoles.push(doc.data());
                });
                setRoles(updatedRoles);
            });
        }
        getRoles();
    }, [db])

    return (
        <div>
        <H>Predbezne prihlaseni hraci</H>
        <P>Celkem: { roles.length && roles.length }</P>
        <P>Celkem hracu kteri maji internet: { roles.length && roles.filter(r => r.hasInternet).length }</P>
        <P>Celkem hracu kteri maji iphone: { roles.length && roles.filter(r => r.phoneType === 'iphone').length }</P>
        <P>Celkem hracu kteri maji android: { roles.length && roles.filter(r => r.phoneType === 'android').length }</P>


        </div>
    )
}

export default Users;