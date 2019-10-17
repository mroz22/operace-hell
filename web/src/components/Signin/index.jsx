import React, { useState } from 'react';
import firebase from 'firebase';

import { H, Input } from '..';

const Signin = ({ user }) => {
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPending, setIsPending ] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const signIn = () => {
        setIsPending(true);
        setIsSuccess(false);
        setError('');
        firebase.auth().signInWithEmailAndPassword(email, password).then((response) => {
            setIsSuccess(true);
            setEmail('');
        }).catch(function(error) {
            setError(error.message);
        }).finally(() => {
            setIsPending(false);
            setPassword('');
        });
    }

    const resetPassword = () => {
        setIsPending(true);
        setIsSuccess(false);
        setError('');
        firebase.auth().sendPasswordResetEmail(email).then(function() {
            setEmail('');
            // Email sent.
        }).catch(function(error) {
            setError(error.message);
        }).finally(() => {
            setIsPending(false);
        });
    }

        return (
        <>
            <H>Prihlasit</H>
            <Input label="email" type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <Input label="heslo" type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <input type="button" value="Prihlasit" onClick={signIn} disabled={isPending}/>
            <br />
            --- nebo --- <br />
            <input type="button" value="Reset password" onClick={resetPassword} disabled={isPending}/>
            <br />
            
            <div>
                {
                    isPending && 'Odesilam'
                }
                {
                    !isPending && isSuccess && 'Hotovo'
                }
                {
                    error ? error : ''
                }
            </div>
        </>
        )

}

export default Signin;