import React from 'react';
import firebase from 'react-native-firebase';
import { TextInput } from 'react-native';

import { Button } from '../../components';

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {
                email: '',
                password: '',
            }
        }
    }

    signin() {
        const { email, password } = this.state.user;
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
          // ...
        });
    }

    render() {
        return (
            <>
            <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => this.setState({newUser: { ...this.state.user, email: text }})}
                value={this.state.user.email}
            />
            <TextInput
                secureEntry={true}
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => this.setState({newUser: { ...this.state.user, password: text }})}
                value={this.state.user.password}
            />
            <Button
                onPress={() => this.signin()}
                title="Sign in"
                color="#843"
                accessibilityLabel="Learn more about this purple button"
            />
            </>
        )
    }
    
}

export default Login;