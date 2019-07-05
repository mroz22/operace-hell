import React from 'react';

import {Text, H} from '../index'

const Meteo = ({ game }) => {
  return (
      <>
        <H>Meteostanice</H>
        <Text>
          Změna záření za minutu: {game.radiationChangeRate}
        </Text>
        <Text>
          Změna směru větru za: {game.ticksToRadiationChange}
        </Text>
      </>
  );
}

export default Meteo;