import React from 'react';

import {Text, H} from '../index'
import { getRadiationInfo } from '../../utils/radiation';

const Geiger = ({ game }) => {
  return (
      <>
        <H>Geigeruv poci</H>
        <Text>
              Aktuální hodnota záření: {' '} 
              <Text style={{ color: getRadiationInfo(game.radiation).color }}>
                {getRadiationInfo(game.radiation).text}
                {' '}
                ({ game.radiation})
              </Text>
              
            </Text>
      </>
  );
}

export default Geiger;