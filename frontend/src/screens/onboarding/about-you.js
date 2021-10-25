import React from 'react';
import {
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {useDispatch, useSelector} from 'react-redux';
import GoButton from '../../components/goButton';
import {SET_ONBOARDING} from '../../actions/globalActions';
import color from '../../styles/color';
import onboardingStyles from './onboardingStyles';

export default function AboutYou({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.accountReducer.userInfoReducer);

  console.log(user);

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        padding: '10%',
        paddingVertical: '20%',
        backgroundColor: color.white,
      }}>
      <Text style={[onboardingStyles.onboardingTitle, {width: '100%'}]}>
        Tell us about yourself
      </Text>
      <View style={{flex: 3, marginVertical: 30}}>
        <Text style={onboardingStyles.promptText}>
          What do you care most about when cooking?
        </Text>
        <Slider
          style={{width: 200, height: 40}}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
        <Text style={onboardingStyles.promptText}>
          How experienced are you in the kitchen?
        </Text>
        <Slider
          style={{width: 200, height: 40}}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
      </View>
      {GoButton("Let's Cook!", () => {
        dispatch({type: SET_ONBOARDING, onboarded: true});
        navigation.replace('MainTabs');
      })}
    </View>
  );
}
