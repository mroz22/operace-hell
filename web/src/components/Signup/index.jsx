import React, { useState } from 'react';
import { firebase } from '../../firebase';

import { H, Input } from '../../components';

const Signup = ({ user }) => {
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPending, setIsPending ] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const signUp = () => {
        setIsPending(true);
        setIsSuccess(false);
        setError('');
        firebase.auth().createUserWithEmailAndPassword(email, password).then((response) => {
            setIsSuccess(true);
            setEmail('');
            console.log(response);
        }).catch(function(error) {
            setError(error.message);
        }).finally(() => {
            setIsPending(false);
            setPassword('');
        });
    }

    return (
        <>
            <H>Registrace</H>
            <Input label="email" type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <Input label="heslo" type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <input type="button" value="Zalozit novy ucet" onClick={signUp} disabled={isPending}/>
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

export default Signup;