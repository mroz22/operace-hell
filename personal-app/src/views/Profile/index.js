import React, { useState } from 'react';
import firebase from 'react-native-firebase';
import { H, Text, Button } from '../../components';
import { Switch } from 'react-native-switch';
import { View } from 'react-native';

const Profile = ({ user, game }) => { 

    const [isPending, setIsPending] = useState(false);
    const [error, setError ] = useState('');
    
    const UNDETECTABLE = 'undetectable';
    const LOW = 'low';
    const MEDIUM = 'medium';
    const HIGH = 'high';
    const CRITICAL = 'critical';

    const eatPill = (color) => {
      setIsPending(true);
      setError('');
      const fn = firebase.functions().httpsCallable('eatPill');
      fn({color}).catch(error => {
        setError(error.message);
      }).finally(() => {
        setIsPending(false);
      });
    }

    const toggleProtectiveSuite = (val) => {
      setIsPending(true);
      setError('');
      const ref = firebase.firestore().collection("users").doc(user.uid);
      ref.update({'status.protectiveSuiteOn':val})
      
      .catch(function(error) {
          setError(error.message);
      }).finally(() => setIsPending(false));
    }

    const getRadiationLevel = (value) => {
      if (value < 2) {
        return UNDETECTABLE;
      }
      if (value < 10) {
        return LOW;
      }
      if (value < 30) {
        return MEDIUM;
      }
      if (value < 60) {
        return HIGH;
      }
      return CRITICAL;
    }

    const getRadiationInfo = (value) => {
      const level = getRadiationLevel(value);
      switch(level) {
        case UNDETECTABLE:
          return {text: 'podprahová míra ozáření', color: 'green' }
        case LOW: 
          return {text: 'mírné ozáření', color: 'green'}
        case MEDIUM:
          return {text: 'střední ozáření', color: 'orange'}
        case HIGH:
          return {text: 'vysoké ozáření', color: 'red'}
        case CRITICAL:  
          return { text: 'extrémní ozáření', color: 'red'}
      }
    } 

    const getDozimeterInfo = (value) => {
      const level = getRadiationLevel(value);
      switch(level) {
        case UNDETECTABLE:
          return {text: 'nedetekovatelná míra záření', color: 'green' }
        case LOW: 
          return {text: 'mírné záření', color: 'green'}
        case MEDIUM:
          return {text: 'střední záření', color: 'orange'}
        case HIGH:
          return {text: 'vysoké záření', color: 'red'}
        case CRITICAL:  
          return { text: 'extrémní záření', color: 'red'}
      }
    } 

    return (
      <>
        {
          game && (
            <>
            <Text>-------</Text>
            <H>Dozimetr</H>
            <Text>-------</Text>
            <Text>
              Aktuální hodnota záření: {' '} 
              <Text style={{ color: getDozimeterInfo(game.radiation).color }}>
                {getDozimeterInfo(game.radiation).text}
                {' '}
                ({ game.radiation})
              </Text>
              
            </Text>

            <Text>
            Změna záření za minutu: {game.radiationChangeRate}
            </Text>
            <Text>
            Změna směru větru za: {game.ticksToRadiationChange}
            </Text>

            </>
          )
        }
        
        <Text>-------</Text>
        <H>Životní funkce {user.role.name}</H>
        <Text>-------</Text>
        
        <Text>Míra ozáření:</Text>
        <Text style={{color: getRadiationInfo(user.role.status.radiation).color}}>
          {getRadiationInfo(user.role.status.radiation).text}
          {' '}
          ({ user.role.status.radiation.toFixed(2)})
        </Text>
        
        <Text>-------</Text>
        <H>Vybevení</H>
        <Text>-------</Text>
              
        {/* <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}> */}
        <Text>{user.role.status.protectiveSuiteOn ? 'Radiační oblek oblečen': 'Radiační oblek není oblečen'}</Text>
        <Switch
          onValueChange={(val) => toggleProtectiveSuite(val)}
          disabled={false}
          circleSize={30}
          value={Boolean(user.role.status.protectiveSuiteOn)}
          backgroundActive={'green'}
          backgroundInactive={'gray'}
          circleActiveColor={'#30a566'}
          circleInActiveColor={'#000000'}
        />
        {/* </View> */}

      <Text>{error && error} { isPending && 'Sync in progress'}</Text>
      </>
    )
}

export default Profile;
 

{/* <Button
                onPress={() => eatPill('blue')}
                title="Eat blue pill"
                color="#33b"
                accessibilityLabel="Learn more about this purple button"
              />
              <Button
                onPress={() => eatPill('green')}
                title="Eat green pill"
                color="#344"
                accessibilityLabel="Learn more about this purple button"
              />
              <Button
                onPress={() => eatPill('red')}
                title="Eat blue pill"
                color="#ff0000"
                accessibilityLabel="Learn more about this purple button"
        /> */}