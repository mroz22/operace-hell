import React, { useState } from 'react';
import { Wrapper, Options, Option, Description, Input}  from '../index';
import {firebase} from '../../firebase';

export default ({ role, survivorsLeft, onEnter, onSituationCancel }) => {
    const callEnterPassword = firebase.functions().httpsCallable('enterPassword');

    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');

    const [isPending, setIsPending ] = useState(false);
    const [passResult, setPassResult] = useState('');

    const onPasswordEnter = async () => {
        if (isPending) return;
        try {
            setPassResult('');
            setIsPending(true);
            const result = await callEnterPassword({ pass1, pass2 })
            setPassResult(result.data)
        } catch (err) {
            setPassResult('error, nepovedlo se odeslat heslo')
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Wrapper>
            {
                !role.status.hasEnteredSecretChamber && (
                    <>
                    <Description>Stojis pred bunkrem desive vypadajicim bunkrem. Vsude okolo se vali kosti 
                    lidi, zvirat, a taky bytosti, ktere mozna jako lide svou pout zacaly, ale jako zvirata ji dokoncily. Co chces udelat? </Description>
                    <Options>
                    <Option onClick={() => onEnter()}>Vstoupit</Option>
                    <Option onClick={() => onSituationCancel()}>Odejit</Option>
                    </Options>
                    </>
                )
            }

            {
                role.status.hasEnteredSecretChamber && (
                    <>
                    <Description>
                    Vesel jsi dovnitr. Naproti tobe se nachazi dvere a na nich sviti velke cislice. Co asi znamena?
                    </Description>
                    <div style={{ fontSize: '8em', textAlign: 'center'}}>
                        {survivorsLeft}
                    </div>
                    <Description>
                    Na dverich jsou dve klavesnice. Jedna s pismeny, druha s cisly. Neco ti rika, ze aby ses dostal dovnitr, budes muset na obou zadat spravne heslo.
                    </Description>
                    <Input disabled={isPending} label="cisla" type="test" onChange={(event) => setPass1(event.target.value)} />
                    <Input disabled={isPending} label="pismena" type="test" onChange={(event) => setPass2(event.target.value)} />
                    { isPending && 'Probiha odesilani hesla'}
                    { passResult }
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