import React from 'react';

import {Text, H} from '../index'
import { getDoseInfo } from '../../utils/radiation';

const Dozimetr = ({ role }) => {
  return (
      <>
        <H>Dozimetr</H>
        <Text>Míra ozáření:</Text>
        <Text style={{color: getDoseInfo(role.status.radiation).color}}>
          {getDoseInfo(role.status.radiation).text}
          {' '}
          ({ role.status.radiation.toFixed(2)})
        </Text>
      </>
  );
}

export default Dozimetr;