import React from 'react';
import { Wrapper, Options, Option, Description}  from '../index';

export default ({ role, game, onEnter, onSituationCancel }) => {
    return (
        <Wrapper>
            {
                !role.status.trappedUntilEpoch && (
                    <>
                    <Description></Description>
                    <Options>
                    <Option onClick={() => onEnter()}>Vstoupit</Option>
                    <Option onClick={() => onSituationCancel()}>Odejit</Option>
                    </Options>
                    </>
                )
            }

            {
                role.status.trappedUntilEpoch && (
                    <>
                    <Description>
                    Z neceho, co predtim vypadalo jako hromada smeti z niceho nic na tebe vystrelila sit! Zasahla te a pevne omotala, nemuzes se hybat. Chvili nechapes co se stalo ale pak ti to dojde - je to past!
                    </Description>
                    <Description>Vypada to, ze nemas nic zlomeneho a za nejakou dobu se ti povede ze site vymotat (kamaradi, pokud nejake mas, ti nepomuzou, sit je prilis zasmodrchana, to musis zvladnout sam)</Description>
                    <Description>
                        Vymotas se za:
                    </Description>    
                    </>
                )
            }
        </Wrapper>
    )
}