import {takeLatest, call, put} from 'redux-saga/effects';
import axios from 'axios';
import {API_URL} from '@env';
import storage from '@react-native-firebase/storage';
import {
  FEATURED_FEED,
  FORYOU_FEED,
  GET_FEED,
  REPLACE_FEED,
  SEARCH_FEED,
  SEARCH_RESULT,
} from '../actions/feedActions';
import {SET_LOADING, SET_ALERT} from '../actions/globalActions';

function* searchFeedCall(param) {
  try {
    const apiConfig = {
      method: 'get',
      url: `${API_URL}/recipe?keyword=${param.keyword}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = yield call(axios, apiConfig);
    const resultsArray = response.data[0];
    console.log(
      '[INFO]: SEARCH FEED API: Recipe obtained = ' +
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
    yield put({type: SEARCH_RESULT, payload: recipeArray});
  } catch (e) {
    console.log('Get Feed Failed');
    yield put({
      type: SET_ALERT,
      alert: true
    });
  }
}

function* getFullFeed(param) {
  yield getFeaturedCall(param);
  yield getFeedCall(param);
  yield put({type: SET_LOADING, loading: false});
}

function* getFeedCall(param) {
  try {
    let apiConfig = {
      method: 'get',
      url: `${API_URL}/recipe?start=${param.startIndex}&limit=30`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (!param.user.recipe_driven) {
      apiConfig = {
        method: 'get',
        url: `${API_URL}/recipe/driven?start=${param.startIndex}&limit=30&user=${param.user.user_id}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    const response = yield call(axios, apiConfig);
    const resultsArray = response.data[0];
    console.log(
      `[INFO]: GET FEED API @ Index ${param.startIndex}: Recipe obtained = ` +
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
    yield put({type: (param.startIndex === 0) ? REPLACE_FEED : FORYOU_FEED, payload: recipeArray});
  } catch (e) {
    console.log('Get Feed Failed: ' + e);
    yield put({
      type: SET_ALERT,
      alert: true
    });
  }
}

function* getFeaturedCall(param) {
  try {
    const apiConfig = {
      method: 'get',
      url: `${API_URL}/recipe/featured`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = yield call(axios, apiConfig);
    const resultsArray = response.data[0];
    console.log(
      '[INFO]: GET FEATURED FEED API: Recipe obtained = ' +
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
    yield put({type: FEATURED_FEED, payload: recipeArray});
  } catch (e) {
    console.log('Get Featured Feed Failed: ' + e);
    yield put({
      type: SET_ALERT,
      alert: true
    });
  }
}

export function* getFeed() {
  yield takeLatest(GET_FEED, getFullFeed);
}

export function* searchFeed() {
  yield takeLatest(SEARCH_FEED, searchFeedCall);
}
