import React from 'react';
import { Wrapper, Options, Option, Description }  from '../Dozimeter/components';


export default ({ bunker, role, onEnterBunker, onSituationCancel }) => {
    if (role.BunkerId && role.BunkerId !== bunker.id) {
        return (
            <Wrapper>
                <Description>
                Tohle vypada, ze jsi se neodhlasil z bunkru, ve kterem jsi byl predtim. Bacha na to.
                </Description>
                <Options>
                    <Option onClick={() => onEnterBunker("")}>Odejit</Option>
                </Options>
            </Wrapper>
        )
    }
    if (role.BunkerId && role.BunkerId === bunker.id) {
        return (
            <Wrapper>
            <Description>
                V tomto bunkru uz jsi. 
            </Description>
            <Options>
            <Option onClick={() => onEnterBunker('')}>Odejit</Option>
            <Option onClick={() => onSituationCancel()}>Zrusit</Option>
            </Options>

            </Wrapper>
        )
    }
    return (
        <Wrapper>
            <Description>Stojis pred bunkrem { bunker.name }. Co chces udelat?</Description>
            {/* <div>{JSON.stringify(bunker)}</div> */}
            <Options>
            <Option onClick={() => onEnterBunker(bunker.id)}>Vstoupit</Option>
            <Option onClick={() => onSituationCancel()}>Zrusit</Option>
            </Options>

        </Wrapper>
    )
}