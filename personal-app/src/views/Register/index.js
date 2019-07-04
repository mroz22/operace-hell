import React from 'react';
import firebase from 'react-native-firebase';
import { TextInput } from 'react-native';

import { Button } from '../../components';

class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {
                email: '',
                password: '',
            }
        }
    }

    signup() {
        const { email, password } = this.state.newUser;
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
          // ...
        });
    }
    
    signout() {
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
        }).catch(function(error) {
          // An error happened.
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
                onPress={() => this.signup()}
                title="Sign up"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
            </>
        )
    }
}

export default Register;