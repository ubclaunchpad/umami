import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import color from '../../styles/color';

const screenWidth = Dimensions.get('screen').width;

export default StyleSheet.create({
    Title: {
        fontSize: 26,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: color.black,
        marginLeft: 18,
    },
    Next: {
        fontSize: 18,
        color: color.lightGey,
        marginRight: 18,
    },
    textBox: {
        marginTop: 30,
        borderWidth: 1,
        borderColor: color.textGray,
        borderRadius: 35,
        paddingHorizontal: 18,
        paddingVertical: 16,
        marginHorizontal: 16,
        alignSelf: 'center',
        width: 300,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textInput: {
        height: 16,
        borderColor: color.gray,
        paddingTop: 0,
        paddingBottom: 0,
    },
});