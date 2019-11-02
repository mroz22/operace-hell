import React from 'react';
import { Wrapper, Options, Option, Description}  from '../index';

export default ({ role, targetRole, onEnter, onSituationCancel }) => {
    if (role.id === targetRole.id) {
        return (
            <Wrapper>
                <Description>Je to divne, prohlizis si sam sebe</Description>
                <Options>
                    <Option onClick={() => onSituationCancel()}>Kaslat na to</Option>
                </Options>
            </Wrapper>
        )
    }
    return (
        <Wrapper>
            <Description>
                Prohlizis si { targetRole.name }. 
                { targetRole.status.injury === 'none' && 'Vypada celkem zdrave.'}
                { targetRole.status.injury === 'light' && 'Je lehce zranen. Jeden medkit a bude zase v pohode.'}
                { targetRole.status.injury === 'heavy' && 'Ma tezke zraneni, jeden by rekl, ze je pekne rozmrdanej. Bez operace provedene odbornou osobou to nepujde.'}
                { targetRole.status.injury === 'lethal' && 'Je mrtvy. Tuhy jak veka.'}
                { targetRole.status.mutations.length === 0 && 'Krom toho to vypada, ze nema zadne mutace. ' }
                { targetRole.status.mutations.length > 0 && 'Vypada ze uz zacina trochu mutovat. ' }
            </Description>
            <Options>
                <Option onClick={() => onSituationCancel()}>Operovat</Option>
                <Option onClick={() => onSituationCancel()}>Odejit</Option>
            </Options>
        </Wrapper>
    )
}