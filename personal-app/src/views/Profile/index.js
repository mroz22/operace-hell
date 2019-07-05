import React, { useState } from 'react';
import firebase from 'react-native-firebase';
import { H, Text, Button } from '../../components';
import { Switch } from 'react-native-switch';
import { View } from 'react-native';

import { getRadiationInfo } from '../../utils/radiation';
import Geiger from '../../components/Geiger';
import Meteo from '../../components/Meteo';
import Dozimetr from '../../components/Dozimetr';

const Profile = ({ user, game }) => { 

    const [isPending, setIsPending] = useState(false);
    const [error, setError ] = useState('');
    
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

    return (
      <>
        {
          game && (
            <>
            { 
              user.role.status.hasMeteo && <Meteo game={game} />
            }
            {
              user.role.status.hasGeiger && <Geiger game={game}/>
            }
            {
              user.role.status.hasDozimetr && <Dozimetr role={user.role}/>
            }
          
            </>
          )
        }
        
        <Text>-------</Text>
        <H>Vybavení</H>
        <Text>-------</Text>
              
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

        <Text>{error && error} { isPending && 'Sync in progress'}</Text>
      </>
    )
}

export default Profile;
 
// const eatPill = (color) => { 
//   setIsPending(true); 
//   setError(''); 
//   const fn = firebase.functions().httpsCallable('eatPill'); 
//   fn({color}).catch(error => { 
//     setError(error.message); 
//   }).finally(() => { 
//     setIsPending(false); 
//   }); 
// } 

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