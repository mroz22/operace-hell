import React from 'react';
import { Wrapper, Options, Option, Description}  from '../index';

export default ({ role, game, onEnter, onSituationCancel }) => {
    const explored = !role.status.trappedUntilEpoch || (role.status.trappedUntilEpoch - game.epoch) < 0;
    const diff = role.status.trappedUntilEpoch - game.epoch;
    return (
        <Wrapper>
            {
                !explored &&  (
                    <>
                    <Description>
                    V rohu mistnosti se nachazi hromada haraburdi. Mohlo by tam byt neco zajimaveho.    
                    </Description>
                    <Options>
                    <Option onClick={() => onEnter()}>Prozkoumat</Option>
                    <Option onClick={() => onSituationCancel()}>Odejit</Option>
                    </Options>
                    </>
                )
            }

            {
                explored && diff > 0 && (
                    <>
                    <Description>
                    Z neceho, co predtim vypadalo jako hromada smeti z niceho nic na tebe vystrelila sit! Zasahla te a pevne omotala, nemuzes se hybat. Chvili nechapes co se stalo ale pak ti to dojde - je to past!
                    </Description>
                    <Description>Vypada to, ze nemas nic zlomeneho a za nejakou dobu se ti povede ze site vymotat (kamaradi, pokud nejake mas, ti nepomuzou, sit je prilis zasmodrchana, to musis zvladnout sam)</Description>
                    <Description>
                        Vymotas se za: { diff }
                    </Description>    
                    </>
                )
            }
            {
                explored && diff < 0 && (
                    <>
                    <Description>
                        Uz to znas. Nastrazena sit kolem tebe neskodne prosvistela a tentokrat te nechytla.
                    </Description>
                    </>
                )
            }
        </Wrapper>
    )
}