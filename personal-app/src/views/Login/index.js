import React, { useState } from 'react';
import firebase from 'react-native-firebase';
import { TextInput, Text } from 'react-native';

import { Button, H } from '../../components';

const Login = () => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState('');
    const [ isPending, setIsPending ] = useState(false);

    const signin = () => {
        setIsPending(true);
        setError('');
        firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
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
            <H>Login</H>
            <TextInput
                placeholder={'email'}
                style={{height: 40, width: '90%', borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => setEmail(text)}
                value={email}
            />
            <TextInput
                secureTextEntry
                placeholder={'heslo'}
                style={{height: 40, width: '90%', borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => setPassword(text)}
                value={password}
            />
            <Button
                disabled={!email || !password || isPending}
                onPress={() => signin()}
                title="Sign in"
                color="#843"
                accessibilityLabel="Learn more about this purple button"
            />
            <Text>
                { error && error }
            </Text>
            <Text>
                { isPending && 'please wait'}
            </Text>
            </>
        )    
}

export default Login;