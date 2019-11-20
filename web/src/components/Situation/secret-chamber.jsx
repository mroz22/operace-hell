import React from 'react';
import { Wrapper, Options, Option, Description }  from '../index';

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
                V tomto bunkru ({ bunker.name }). uz jsi. 
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
            {
                !bunker.isDestroyed && (
                    <>
                    <Description>Stojis pred desive vypadajicim bunkrem. Vsude okolo se vali kosti 
                    lidi, zvirat, a taky bytosti, ktere mozna jako lide svou pout zacaly, ale jako zvirata ji dokoncily. Co chces udelat? </Description>
                    <Options>
                    <Option onClick={() => onEnterBunker(bunker.id)}>Vstoupit</Option>
                    <Option onClick={() => onSituationCancel()}>Zrusit</Option>
                    </Options>
                    </>
                )
            }

            {
                bunker.isDestroyed && (
                    <>
                    <Description>Stojis pred bunkrem "{ bunker.name }". Jenze je zniceny, vytavil se jeho reaktor.
                    Dvere jsou dokoran a z jeho hlubin to zlovestne huci.
                    Muzes se na nej tak nanejvys smutne divat. Do vnitr vstoupit smis, ale jiz neziskas ochranu 
                    proti radiaci </Description>
                    <Options>
                    <Option onClick={() => onSituationCancel()}>Zrusit</Option>
                    </Options>
                    </>
                )
            }
            

        </Wrapper>
    )
}