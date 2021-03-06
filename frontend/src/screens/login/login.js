import React, { useState, useRef } from 'react';
import {
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Image,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import GoButton from '../../components/goButton';
import color from '../../styles/color';
import loginStyles from './loginStyles';
import { SET_ONBOARDING, SET_ALERT } from '../../actions/globalActions';
import { GET_USER } from '../../actions/accountActions';
import Alerts from '../../components/Alerts';

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const [email, onEmailChange] = useState('');
  const [password, onPasswordChange] = useState('');
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const alert = useSelector(state => state.globalReducer.alertReducer);

  // Login User
  async function login(loginEmail, loginPassword) {
    if (loginEmail !== '') {
      if (loginPassword !== '') {
        await auth()
          .signInWithEmailAndPassword(loginEmail, loginPassword)
          .then(res => {
            // console.log(res);
            dispatch({ type: GET_USER, userID: res.user.uid });
            dispatch({ type: SET_ONBOARDING, onboarded: true });
          })
          .catch(e => {
            dispatch({ type: SET_ALERT, alert: true });
          }
          );
      } else {
        console.log('Password Cannot Be Empty');
        Alert.alert(
          "Error",
          "Password Cannot Be Empty"
        );
      }
    } else {
      console.log('Email Cannot Be Empty');
      Alert.alert(
        "Error",
        "Email Cannot Be Empty"
      );
    }
  }

  // Function to Pass
  const submitForm = (myEmail, myPassword) => {
    login(myEmail, myPassword);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {Alerts(alert, "Login Error")}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{ flex: 1, margin: 20 }}
            onPress={() => {
              navigation.pop();
              dispatch({ type: SET_ALERT, alert: false });
            }}>
            <Image
              source={require('../../assets/Back.png')}
              style={{
                width: 24,
                height: 24,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              paddingHorizontal: '15%',
              paddingBottom: '30%',
              flex: 3,
            }}>
            <View style={{ flex: 3 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: color.appPrimary,
                }}>
                Login
              </Text>
              <TextInput
                textContentType="emailAddress"
                placeholder="Email"
                autoCorrect={false}
                onChangeText={text => onEmailChange(text)}
                value={email}
                style={loginStyles.textInput}
                placeholderTextColor={color.gray}
                onSubmitEditing={() => {
                  passwordInput.current.focus();
                }}
                ref={emailInput}
              />
              <TextInput
                textContentType="newPassword"
                secureTextEntry
                placeholder="Password"
                autoCorrect={false}
                onChangeText={text => onPasswordChange(text)}
                value={password}
                style={loginStyles.textInput}
                placeholderTextColor={color.gray}
                ref={passwordInput}
              />
              <View style={{ marginTop: 80 }}>
                {GoButton("Let's go!", () => {
                  submitForm(email, password);
                })}
              </View>
              <TouchableOpacity
                style={{ alignSelf: 'center', marginTop: 30 }}
                onPress={() => {
                  navigation.push('Forgot');
                }}>
                <Text style={{ fontWeight: '300' }}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
