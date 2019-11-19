import React, { useState } from 'react';
import {firebase} from '../../firebase';

import { Wrapper, Options, Option, Description}  from '../index';

export default ({ role, character, targetRole, targetCharacter, onSituationCancel }) => {
    const callSurgery = firebase.functions().httpsCallable('surgery');

    const [isPending, setIsPending ] = useState(false);
    const [result, setResult] = useState('');
    
    // console.log(targetRole);
    // console.log('role', role);
    // console.log('character', character);
    const canDoSurgery = character.skills.some((s) => s.name === 'operace-heavy');
    const canDoHeal = character.skills.some((s) => s.name === 'operace-light'); 
    // console.log('canDoSurgery', canDoSurgery);
    // console.log('canDoHeal', canDoHeal);

    if (!targetRole || !targetCharacter) {
        return (
        <Wrapper>
            <Description>
            nepovedlo se naskenovat spravne toho cloveka, tohle by nikdy nemelo nastat
            </Description>
            <Options>
                <Option onClick={() => onSituationCancel()}>Odejit</Option>
            </Options>
        </Wrapper>)
    }

    const startSurgery = async (level) => {
        if (isPending) return;
        try {
            setResult('');
            setIsPending(true);
            const result = await callSurgery({ targetRoleId: targetRole.uid,  level })
            setResult(result.data)
        } catch (err) {
            setResult('error, nepovedlo se odeslat, zkus to znovu nekde na signalu')
        } finally {
            setIsPending(false);
        }
    }


    // if (role.id === targetRole.id) {
    //     return (
    //         <Wrapper>
    //             <Description>Je to divne, prohlizis si sam sebe</Description>
    //             <Options>
    //                 <Option onClick={() => onSituationCancel()}>Kaslat na to</Option>
    //             </Options>
    //         </Wrapper>
    //     )
    // }

    if (isPending) {
        return (
            <Wrapper>
                <Description>
                    Operace byla zahajena, pacient otevren. Snad nenastanou komplikace.
                </Description>
            </Wrapper>
        )
    }
    if (!isPending && result) {
        return (
            <Wrapper>
                <Description>
                    {result}
                </Description>
            <Options>
                <Option onClick={() => onSituationCancel()}>Odejit</Option>
            </Options>
            </Wrapper>
        )
    }
    return (
        <Wrapper>
            <Description>
                Prohlizis si { targetCharacter.name }.
                { targetRole.status.injury === 'none' && 'Vypada celkem zdrave.'}
                { targetRole.status.injury === 'light' && 'Je lehce zranen. Jeden medkit a bude zase v pohode.'}
                { targetRole.status.injury === 'heavy' && 'Ma tezke zraneni, jeden by rekl, ze je pekne rozmrdanej. Bez operace provedene odbornou osobou to nepujde.'}
                { targetRole.status.injury === 'lethal' && 'Je mrtvy. Tuhy jak veka.'}
                { targetRole.status.mutations.length === 0 && 'Co se mutaci tyce, vypada to, ze nema zadne. ' }
                { targetRole.status.mutations.length > 0 && 'Co se mutaci tyce, vypada ze uz zacina trochu mutovat. ' }
            </Description>
            <Options>
                {
                    targetRole.status.injury === 'light' && (canDoHeal || canDoSurgery) && (
                        <Option onClick={() => startSurgery('light')}>Osetrit</Option>
                    )
                }
                {
                    targetRole.status.injury === 'heavy' && canDoSurgery && (
                        <Option onClick={() => startSurgery('heavy')}>Operovat</Option>
                    )
                }
                {
                    targetRole.status.injury === 'lethal' && (
                        <Option onClick={() => onSituationCancel()}>Dat posledni pomazani</Option>
                    )
                }
                <Option onClick={() => onSituationCancel()}>Odejit</Option>
            </Options>
        </Wrapper>
    )
}