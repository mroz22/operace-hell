import React from 'react';
import { Wrapper, Options, Option, Description, Input}  from '../index';

export default ({ role, onEnter, onSituationCancel }) => {
    return (
        <Wrapper>
            {
                !role.status.trappedForEpochs && (
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
                !role.status.trappedForEpochs && (
                    <>
                    <Description></Description>
                    
                    <Options>
                        <Option onClick={() => onPasswordEnter()}>Zadat</Option>
                        <Option onClick={() => onSituationCancel()}>Odejit</Option>
                    </Options>
                    </>
                )
            }
        </Wrapper>
    )
}