import React from 'react';
import { StyleSheet, Platform, Image, View, ScrollView, TextInput, ToolbarAndroid } from 'react-native';
import firebase from 'react-native-firebase';
// import Router from 'react-native-simple-router';

import * as COLOR from './src/constants/colors';
import { Container, H, Button, Text } from './src/components';
import Login from './src/views/Login';
import Register from './src/views/Register';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      newUser: {
        email: 'delsin.dezi@bullbfeer.org',
        password: 'geegkeog',
      },
      users: {},
      usersUpdated: 0,
      game: {
        radiation: 0,
      }
    };
  }

  async componentDidMount() {

    var database = firebase.firestore();

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        database.collection('users').doc(user.uid).onSnapshot((snapshot) => {
          this.setState({ user: { ...user, role: snapshot.data() }})
        });
        this.setState({ user: { ...user, role: { status: { health: 100, radiation: 0 }}} })
      } else {
        this.setState({ user: null})
      }
    });

    // database.collection("users").onSnapshot((querySnapshot) => {
    //   this.setState({ users: {} });
    //   querySnapshot.forEach((doc) => {
    //     const users = this.state.users;
    //     users[doc.id] = doc.data();
    //     this.setState({ users })
    //   });
    // });
    
    // database.collection("game").doc('operacexxx').onSnapshot((querySnapshot) => {
    //   this.setState({ game: querySnapshot.data() })
    // });
  }

  render() {
    return (
      <>
      <ScrollView endFillColor={COLOR.BACKGROUND}>
        
        {/* <Router
          firstRoute={{ name: 'Login', component: Login }}
          headerStyle={styles.header}
        /> */}

        <Container>
          <H>Operace The Game</H>
          <Text>Navazuje na operaci Luxor</Text>
          <Text>Instrukce pred hrou</Text>

        { 
          !this.state.user || 1 && (<>
            <Login />
            <Text>or</Text>
            <Register />
          </>)
        }
        </Container>

        {
          this.state.user && this.state.user.role && (<>
              <H>User profile</H>
              <Text>Name: {this.state.user.role.name}</Text>
              <Text>Health: {this.state.user.role.status.health}</Text>
              <Text>Radiation: {this.state.user.role.status.radiation}</Text>
          
          <Button
            onPress={() => this.signout()}
            title="Sign out"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
          </>)
        }
        
        
      </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    height: 120,
    marginBottom: 16,
    marginTop: 64,
    padding: 10,
    width: 135,
  },
  button: {
    width: '70%',
  },
  header: {
    backgroundColor: '#5cafec',
  },
});
