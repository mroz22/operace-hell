import React from 'react';

import { H, P } from '..';
import * as CONF from '../../config';

const Teams = ({children}) => {
    return (<div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    }}>{children}</div>)
}

const Team = ({children}) => {
    return (<div style={{
        margin: '20px',
        minWidth: '200px'
    }}>{children}</div>)
}

const Users = ({ roles, characters, teams }) => {
    
    if (!roles.length || !characters.length) {
        return null;
    }

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
    
    const getEmpty = (n) => {
        return new Array(n).fill('');
    }

    return (
        <div>
        <H>Prihlaseni hraci (pruzkumnici)</H>
        <P>Celkem: { roles.length && roles.length }</P>
        <P>maji internet: { roles.length && roles.filter(r => r.hasInternet).length }</P>
        <Teams>
        {
            getFormattedData().map((record) => {
                return (
                    <Team key={record.name}>
                        <div style={{ fontWeight: 'bold'}}>
                            {record.name} ({record.roles.length})
                        </div>
                        { record.roles.map(role => {
                            return (<P key={role.name}>{role.name}</P>)
                        })}
                        { getEmpty(CONF.TEAM_MAX_COUNT - record.roles.length).map((empty, index) => {
                            return (<P key={index}>.........</P>)
                        })}
                    </Team>
                )
            })
            
        }
            {/* <Team>
                Na pozadani muzem otevrit novy. Kdyztak se ozvete hlavnimu organizatorovi. Kontakt v pravidlech.
            </Team> */}
        </Teams>

        <H>Top ranking characters</H>
        {
            getSorted().map((record, index) => {
                const [charId] = record
                return (
                    <div key={charId}>
                        {index+1}. {characters && characters.find(ch => ch.id === charId).name}
                    </div>
                )
            })
        }
        
        </div>
    )
}

export default Users;