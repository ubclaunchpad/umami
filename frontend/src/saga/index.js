import {all, fork} from 'redux-saga/effects';
import {getUser, signUp, updateUser} from './accountSaga';
import {getFeed, searchFeed} from './feedSaga';
import {
  addIngredient,
  getAllIngredients,
  getPantry,
  removeIngredient,
  searchIngredients,
} from './pantrySaga';
import {getRecipe, postRecipeLike} from './recipeSaga';
import {getLikedRecipes} from './profileSaga';

export default function* rootSaga() {
  yield all([
    fork(signUp),
    fork(getUser),
    fork(updateUser),
    fork(getFeed),
    fork(searchFeed),
    fork(getRecipe),
    fork(postRecipeLike),
    fork(getPantry),
    fork(getAllIngredients),
    fork(addIngredient),
    fork(removeIngredient),
    fork(getLikedRecipes),
    fork(searchIngredients),
  ]);
}
