import {takeLatest, call, put} from 'redux-saga/effects';
import axios from 'axios';
import storage from '@react-native-firebase/storage';
import {API_URL} from '@env';
import {
  GET_LIKEDRECIPES,
  LIKED_RECIPES,
  GET_MYRECIPES,
  MY_RECIPES,
  GET_NOTIFICATIONS,
  MY_NOTIFICATIONS,
} from '../actions/profileActions';
import { SET_ALERT } from '../actions/globalActions';

function* getLikedRecipesCall(param) {
  try {
    const apiConfig = {
      method: 'get',
      url: `${API_URL}/user_activity/recipe_like?userID=${param.user.user_id}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = yield call(axios, apiConfig);
    const resultsArray = response.data[0];
    console.log(
      '[INFO]: GET LIKEDRECIPESFEED API: Recipe obtained = ' +
        resultsArray.length.toString(),
    );
    const recipeArray = [];
    for (const results of resultsArray) {
      const vegetarian = param.user.vegetarian ? results[11] === 1 : true;
      const vegan = param.user.vegan ? results[12] === 1 : true;
      const pescatarian = param.user.pescatarian ? true : true;
      const gluten_free = param.user.gluten_free ? true : true;
      const dairy_free = param.user.dairy_free ? true : true;
      const keto = param.user.keto ? results[7] > 30 : true;
      const paleo = param.user.paleo ? true : true;

      if (
        vegetarian &&
        vegan &&
        pescatarian &&
        gluten_free &&
        dairy_free &&
        keto &&
        paleo
      ) {
        const recipeObj = {
          recipe_id: results[0],
          name: results[1],
          recipe_description: results[2],
          created_time: results[3],
          user_id: results[4],
          creator_username: results[5],
          header_image: results[6],
          protein: results[7],
          carbs: results[8],
          fat: results[9],
          fiber: results[10],
          calories: results[11],
          servings: results[12],
          vegetarian: results[13],
          vegan: results[14],
          cooking_time: results[20],
        };

        if (results[6].startsWith('gs://')) {
          yield storage()
            .refFromURL(results[6])
            .getDownloadURL()
            .then(res => {
              recipeObj.header_image = res;
              recipeArray.push(recipeObj);
            });
        } else {
          recipeArray.push(recipeObj);
        }
      }
    }

    // console.log(recipeArray);
    yield put({type: LIKED_RECIPES, payload: recipeArray});
  } catch (e) {
    console.log('Get LikedRecipesFeed Failed: ' + e);
    yield put({
      type: SET_ALERT,
      alert: true
    });
  }
}

function* getMyRecipesCall(param) {
  try {
    const apiConfig = {
      method: 'get',
      url: `${API_URL}/recipe/user?user_id=${param.user.user_id}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = yield call(axios, apiConfig);
    const resultsArray = response.data.data;
    console.log(
      '[INFO]: GET MYRECIPESFEED API: Recipe obtained = ' +
        resultsArray.length.toString(),
    );
    const recipeArray = [];
    for (const results of resultsArray) {
      const vegetarian = param.user.vegetarian ? results[11] === 1 : true;
      const vegan = param.user.vegan ? results[12] === 1 : true;
      const pescatarian = param.user.pescatarian ? true : true;
      const gluten_free = param.user.gluten_free ? true : true;
      const dairy_free = param.user.dairy_free ? true : true;
      const keto = param.user.keto ? results[7] > 30 : true;
      const paleo = param.user.paleo ? true : true;

      if (
        vegetarian &&
        vegan &&
        pescatarian &&
        gluten_free &&
        dairy_free &&
        keto &&
        paleo
      ) {
        const recipeObj = {
          recipe_id: results[0],
          name: results[1],
          recipe_description: results[2],
          created_time: results[3],
          user_id: results[4],
          creator_username: results[5],
          header_image: results[6],
          protein: results[7],
          carbs: results[8],
          fat: results[9],
          fiber: results[10],
          calories: results[11],
          servings: results[12],
          vegetarian: results[13],
          vegan: results[14],
          cooking_time: results[20],
        };

        if (results[6].startsWith('gs://')) {
          yield storage()
            .refFromURL(results[6])
            .getDownloadURL()
            .then(res => {
              recipeObj.header_image = res;
              recipeArray.push(recipeObj);
            });
        } else {
          recipeArray.push(recipeObj);
        }
      }
    }

    // console.log(recipeArray);
    yield put({type: MY_RECIPES, payload: recipeArray});
  } catch (e) {
    console.log('Get MyRecipesFeed Failed: ' + e);
    yield put({
      type: SET_ALERT,
      alert: true
    });
  }
}

function* getMyNotificationsCall(param) {
  try {
    const apiConfig = {
      method: 'get',
      url: `${API_URL}/user/notifications?userID=${param.user.user_id}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = yield call(axios, apiConfig);
    const notificationArray = response.data[0];
    console.log(
      '[INFO]: GET MY NOTIFICATIONS FEED API: Notifications obtained = ' +
        notificationArray.length.toString(),
    );

    // console.log(resultsArray);

    const dayMap = {};
    const dataObj = [];
    for (const item of notificationArray) {
      const d = new Date(item[3]);
      let dayTitle;
      if (d.getDate() === new Date().getDate()) {
        dayTitle = 'Today';
      } else if (d.getDate() === new Date().getDate() - 1) {
        dayTitle = 'Yesterday';
      } else {
        dayTitle = 'Earlier';
      }

      yield storage()
        .refFromURL(`gs://umami-2021.appspot.com/Users/${item[1]}.jpg`)
        .getDownloadURL()
        .then(res => {
          const notificationObj = {
            name: item[8],
            recipe: item[7],
            recipeid: item[5],
            time: dayTitle,
            img: {uri: res},
          };

          if (dayMap[dayTitle]) {
            dayMap[dayTitle].push(notificationObj);
          } else {
            dayMap[dayTitle] = [notificationObj];
          }
        })
        .catch(e => {
          console.log('No User Image: ' + e);
          const notificationObj = {
            name: item[8],
            recipe: item[7],
            recipeid: item[5],
            time: dayTitle,
            img: require('../assets/Profilepicture.png'),
          };

          if (dayMap[dayTitle]) {
            dayMap[dayTitle].push(notificationObj);
          } else {
            dayMap[dayTitle] = [notificationObj];
          }
        });
    }

    if (dayMap['Today']) {
      dataObj.push({key: 'Today', title: 'Today', data: dayMap['Today']});
    }

    if (dayMap['Yesterday']) {
      dataObj.push({
        key: 'Yesterday',
        title: 'Yesterday',
        data: dayMap['Yesterday'],
      });
    }

    if (dayMap['Earlier']) {
      dataObj.push({key: 'Earlier', title: 'Earlier', data: dayMap['Earlier']});
    }

    yield put({type: MY_NOTIFICATIONS, payload: dataObj});
  } catch (e) {
    console.log('Get My Notifications Failed: ' + e);
    yield put({
      type: SET_ALERT,
      alert: true
    });
  }
}

export function* getLikedRecipes() {
  yield takeLatest(GET_LIKEDRECIPES, getLikedRecipesCall);
}

export function* getMyRecipes() {
  yield takeLatest(GET_MYRECIPES, getMyRecipesCall);
}

export function* getMyNotifications() {
  yield takeLatest(GET_NOTIFICATIONS, getMyNotificationsCall);
}
