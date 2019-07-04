import React from 'react';
import { Text as RNText, View, Button as RNButton } from 'react-native';

import * as COLOR from '../constants/colors';

export const H = (props) => (
    <RNText style={{fontSize: 16, fontWeight: 'bold', color: COLOR.TEXT}}>{props.children}</RNText>
);

export const Text = (props) => (
    <RNText style={{ color: COLOR.TEXT }} {...props}>{props.children}</RNText>
);

export const Container = (props) => (
    <View style={{flex: 1, height: '100%', justifyContent: 'center', backgroundColor: COLOR.BACKGROUND, alignItems: 'center' }}>{props.children}</View>
);

export const Button = (props) => (
    <View style={{ width: '100%', padding: 10 }}>
        <RNButton {...props} />
    </View>
);