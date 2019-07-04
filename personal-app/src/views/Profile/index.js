import React from 'react';

class Profile extends React.Component { 
    constructor() {

    }
    
    componentDidMount() {

    }
}

/*

 <Button
                onPress={() => this.eatPill('blue')}
                title="Eat blue pill"
                color="#33b"
                accessibilityLabel="Learn more about this purple button"
              />
              <Button
                onPress={() => this.eatPill('green')}
                title="Eat green pill"
                color="#344"
                accessibilityLabel="Learn more about this purple button"
              />
              <Button
                onPress={() => this.eatPill('red')}
                title="Eat blue pill"
                color="#ff0000"
                accessibilityLabel="Learn more about this purple button"
              />

              <View style={styles.container}>
          <Image source={require('./assets/ReactNativeFirebase.png')} style={[styles.logo]}/> 
          <H>Game overview</H>
          <Text>
            Total: { Object.keys(this.state.users).length}
          </Text>
          {Object.keys(this.state.users).map((user) => {
            const usr = this.state.users[user];
            return (<Text key={user}>{usr.name}, rad: {usr.status.radiation && usr.status.radiation }</Text>)
          })}
          <Text>Radiation: {this.state.game.radiation}</Text>
        </View>


  eatPill(color) {
    var fn = firebase.functions().httpsCallable('eatPill');
    fn({color}).then(function(result) {});
  }
*/