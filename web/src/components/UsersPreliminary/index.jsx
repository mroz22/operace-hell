import React from 'react';

import { H, P } from '../../components';

const Users = ({ roles, characters }) => {
    
    if (!roles || !roles.length) {
        return null;
    }

    const getSorted = () => {
        const result = {}
        roles.forEach(role => {
            if (role.characterId) {
                if(!result[role.characterId]) {
                    result[role.characterId] = 0;
                }
                result[role.characterId]++;
            }
        })
        return Object.entries(result).sort((n1,n2) =>  n2[1] - n1[1]);
    }

    const getMostFavorite = () => {
        const sorted = getSorted();
        console.log(sorted)
        return characters.find(ch => ch.id === sorted[0][0]).name
    }

    return (
        <div>
        <H>Predbezne prihlaseni hraci</H>
        <P>Celkem: { roles.length && roles.length }</P>
        <P>Celkem hracu kteri maji internet: { roles.length && roles.filter(r => r.hasInternet).length }</P>
        <P>Celkem hracu kteri maji iphone: { roles.length && roles.filter(r => r.phoneType === 'iphone').length }</P>
        <P>Celkem hracu kteri maji android: { roles.length && roles.filter(r => r.phoneType === 'android').length }</P>
        <P>Nejcasteji zvoleny charakter: {getMostFavorite()}</P>
        </div>
    )
}

export default Users;