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

const Team = ({name, color, roles = [], maxCount}) => {
    const getEmpty = (n) => {
        if (n > 0) {
            return new Array(n).fill('');
        }
        return [];
    }

    return (<div style={{
        margin: '20px',
        minWidth: '200px'
    }}>
        <div style={{ fontWeight: 'bold', backgroundColor: color }}>
            {color} ({roles.length})
        </div>
        { roles.map((role, index) => {
            return (<P key={role.id}>{role.name}</P>)
        })}
        { getEmpty(maxCount - roles.length).map((empty, index) => {
            return (<P key={index}>.........</P>)
        })}
    </div>)
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

    const getWildlings = () => {
        if (!roles.length) {
            return [];
        }
        return roles.filter(r => r.roleType === 'divoky');
    }

    const getOrgs = () => {
        if (!roles.length) {
            return [];
        }
        return roles.filter(r => r.roleType === 'org');
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
    
    

    return (
        <div>
        <H>Prihlaseni hraci (pruzkumnici)</H>
        <P>Celkem: { roles.length && roles.length }</P>
        <Teams>
        {
            getFormattedData().map((record) => {
                return (
                    <Team key={record.name} color={record.color} name={record.name} roles={record.roles} maxCount={CONF.TEAM_MAX_COUNT} />
                )
            })
            
        }
            {/* <Team>
                Na pozadani muzem otevrit novy. Kdyztak se ozvete hlavnimu organizatorovi. Kontakt v pravidlech.
            </Team> */}
        </Teams>

        <H>Top ranking characters</H>
        <div style={{margin: '15px 0 15px 15px'}}>
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

        <H>Divoci a orgove</H>
        <Teams>
            <Team name="Divoci" roles={getWildlings()} maxCount={CONF.DIVOCI_MAX_COUNT} />
            <Team name="Orgove" roles={getOrgs()} maxCount={CONF.ORGS_MAX_COUNT} />
        </Teams>
        
        </div>
    )
}

export default Users;