import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { API_URL } from '@env';
import {
  GET_USER,
  POST_USER,
  PUT_USER,
  USER_INFO,
  POST_USER_TOKEN,
} from '../actions/accountActions';
import { SET_ALERT } from '../actions/globalActions';

function* signUpCall(param) {
  try {
    const data = JSON.stringify(param.payload);
    const apiConfig = {
      method: 'post',
      url: `${API_URL}/user`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    const response = yield call(axios, apiConfig);
    const results = response.data;
    console.log('[INFO]: POST USER API:');
    console.log(results);
    yield put({
      type: USER_INFO,
      payload: {
        user_id: param.payload.user_id,
        username: param.payload.username,
        email: param.payload.email,
        first_name: '',
        last_name: '',
        profile_picture: '',
        location: '',
        recipe_driven: true,
        vegetarian: false,
        vegan: false,
        pescatarian: false,
        gluten_free: false,
        dairy_free: false,
        keto: false,
        paleo: false,
        style: 'ANY',
        experience: 0.5,
      },
    });
  } catch (e) {
    console.log('Signup Failed');
    yield put({
      type: SET_ALERT,
      alert: true
    });
  }
}

function* updateUserCall(param) {
  try {
    const data = JSON.stringify(param.payload);
    const apiConfig = {
      method: 'put',
      url: `${API_URL}/user`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    const response = yield call(axios, apiConfig);
    const results = response.data;
    console.log('[INFO]: PUT USER API:');
    console.log(results);
    yield put({
      type: USER_INFO,
      payload: param.payload,
    });
  } catch (e) {
    console.log('Update User Failed');
    yield put({
      type: SET_ALERT,
      alert: true
    });
  }
}

function* getUserCall(param) {
  try {
    const apiConfig = {
      method: 'get',
      url: `${API_URL}/user?userID=${param.userID}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = yield call(axios, apiConfig);
    const results = response.data[0];
    console.log(`[INFO]: GET USER API: ${results[0][0]} and ${results[0][4]}`);
    const userObj = {
      user_id: results[0][0],
      username: results[0][1],
      first_name: results[0][2],
      last_name: results[0][3],
      email: results[0][4],
      profile_picture: results[0][5],
      location: results[0][6],
      recipe_driven: results[0][7] === 1,
      vegetarian: results[0][8] === 1,
      vegan: results[0][9] === 1,
      pescatarian: results[0][10] === 1,
      gluten_free: results[0][11] === 1,
      dairy_free: results[0][12] === 1,
      keto: results[0][13] === 1,
      paleo: results[0][14] === 1,
      style: results[0][15],
      experience: results[0][16],
    };
    yield put({type: USER_INFO, payload: userObj});
  } catch (e) {
    console.log('Get User Failed');
    yield put({
      type: SET_ALERT,
      alert: true
    });
  }
}

function* registerUserTokenCall(param) {
  try {
    const apiConfig = {
      method: 'post',
      url: `${API_URL}/user/token?userID=${param.payload.userID}&token=${param.payload.token}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    console.log(`[INFO]: POST USER TOKEN API: ${param.payload.token}`);
    yield call(axios, apiConfig);
  } catch (e) {
    console.log(e);
    console.log('User token registeration failed');
    yield put({
      type: SET_ALERT,
      alert: true
    });
  }
}

export function* signUp() {
  yield takeLatest(POST_USER, signUpCall);
}

export function* getUser() {
  yield takeLatest(GET_USER, getUserCall);
}

export function* updateUser() {
  yield takeLatest(PUT_USER, updateUserCall);
}

export function* registerUserToken() {
  yield takeLatest(POST_USER_TOKEN, registerUserTokenCall);
}
