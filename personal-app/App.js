import React, { useState, useEffect } from 'react';
import { Platform, Image, View, ScrollView, TextInput, ToolbarAndroid, TouchableHighlight, Modal, Alert } from 'react-native';
import firebase from 'react-native-firebase';

import * as COLOR from './src/constants/colors';
import { Container, H, Button, Text } from './src/components';
import Login from './src/views/Login';
import Profile from './src/views/Profile';

import Qr from './src/components/Qr';

const App = () => {
    const [user, setUser] = useState(null);
    const [game, setGame] = useState(null);

    const [qrIsActive, setQrIsActive] = useState(false);

    const [signoutPending, setSignoutPending] = useState(false);
    const [signoutError, setSignoutError] = useState('');

    const [gameSituationInProgress, setGameSituationInProgress] = useState(false);
    const [gameSituationResult, setGameSituationResult] = useState(null);
    const [gameSituationError, setGameSituationError] = useState('');

    const resolveGameSituation = async (type) => {
      setGameSituationInProgress(true);
      try {
        const response = await firebase.functions().httpsCallable('resolveGameSituation')({ type }); 
        setGameSituationResult(response.data);
      } catch (err) {
        setGameSituationError(err.message);
      }
      setGameSituationInProgress(false);
    }


    useEffect(() => {
      const database = firebase.firestore();
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          database.collection('users').doc(user.uid).onSnapshot((snapshot) => {
            setUser({ ...user._user, role: snapshot.data() })
          });
        } else {
          setUser(null)
        }
      });
  
      database.collection("game").doc('operacexxx').onSnapshot((querySnapshot) => {
        setGame(querySnapshot.data())
      });

    }, [])

    
  const signout = () => {
    setSignoutPending(true);
    setSignoutError('')
    firebase.auth().signOut().then(function() {
      setUser(null);
    }).catch(function(error) {
      setSignoutError(error.message);
    }).finally(() => {
      setSignoutPending(false);
    });
  }
  
    if (!user) {
      return (
      <ScrollView endFillColor={COLOR.BACKGROUND}>
      <Container>
          <H>Operace HELL</H>
          <Text>Pro pokracovani je nutne se prihlasit pomoci emailu a hesla z registrace na webu</Text>
          <Login />
      </Container>
      </ScrollView>
      )
    }

    return (
      <ScrollView endFillColor={COLOR.BACKGROUND}>
      <Container>
        {
          user.role && (<>
              <Profile user={user} game={game}/>
          </>)
        }
        
        <Button
          onPress={() => signout()}
          title="Odhlasit"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        
        <Button
          onPress={() => { setGameSituationInProgress(true); setQrIsActive(true)}}
          title="Vyresit herni situaci"
          color="#84b584"
          accessibilityLabel="Learn more about this purple button"
        />

        <Text>
            {gameSituationInProgress && 'Vyhodnocuje se herni situace'}
            {gameSituationError && `Chyba pri zpracovani herni situace: ${gameSituationError}`}
            {gameSituationResult &&  `Vysledek herni situace: ${gameSituationResult}` }
        </Text>
      </Container>
        

      <Modal
          animationType="slide"
          transparent={false}
          visible={gameSituationInProgress}
          onRequestClose={() => {
            setGameSituationInProgress(false);
          }}>
            <View>
              <TouchableHighlight
                onPress={() => {
                  setQrIsActive(false);
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
            <View>
              {
                qrIsActive && <Qr onScanned={(val) => { resolveGameSituation(val); setQrIsActive(false)}} /> 
              }
            </View>
        </Modal>  
      </ScrollView>
    );
}

export default App;