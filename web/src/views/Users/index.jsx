import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase';

import { H, P } from '../../components';

const Teams = ({children}) => {
    return (<div style={{
        display: 'flex',
        flexDirection: 'row',
    }}>{children}</div>)

}
const Team = ({children}) => {
    return (<div>{children}</div>)
}

const Users = () => {
    const [roles, setRoles] = useState([]);

    const [teams, setTeams] = useState([]);

    const db = firebase.firestore();

    const getFormattedData = () => {
        if (!teams.length || !roles.length) {
            return [];
        }
        const data = [];
        teams.forEach(team => {
            const teamWithRoles = team;
            teamWithRoles.roles = [];
            roles.forEach(role => {
                if (role.TeamId === team.id) {
                    teamWithRoles.roles.push(role);
                }
            });
            data.push(teamWithRoles);
        });
        return data;
    };

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
    
        const getTeams = () => {
            const newTeams = [];
            db.collection("teams").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    newTeams.push({ id: doc.id,...doc.data()});
                });
                setTeams(newTeams);
            });
        };
        getRoles();
        getTeams();
    }, [db])

    return (
        <div>
        <H>Prihlaseni hraci</H>
        <P>{ roles.length && roles.length }</P>
        <Teams>
        {
            getFormattedData().map((record) => {
                return (
                    <Team key={record.name}>
                        {record.name} ({record.roles.length})
                        { record.roles.map(role => {
                            return (<P key={role.name}>{role.name}</P>)
                        })}
                    </Team>
                )
            })
        }
        </Teams>
        </div>
    )
}

export default Users;