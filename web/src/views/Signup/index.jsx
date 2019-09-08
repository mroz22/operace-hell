import React, { useState } from 'react';
import firebase from 'firebase';

import { H, P } from '../../components';

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

        return (
        <>
            <H>Predbezna registrace</H>
            <P>Sondujeme zajem o ucast v danem terminu. Za nejaky cas se objevi v registraci moznost prirazeni teamu. Taky na vas po 
            prihlaseni vyskoci par otazek, tak je prosim zodpovezte. Pomuze nam to hru lip pripravi. </P>

            <form>
            <label>
            Email:
            <input type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <br />
            <label>
            Heslo:
            <input type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <br />
            <input type="button" value="Zalozit novy ucet" onClick={signUp} disabled={isPending}/>
            <br />
            <input type="button" value="Prihlasit" onClick={signIn} disabled={isPending}/>
            </form>
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