import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Platform,
  FlatList,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {v4 as uuidv4} from 'uuid';
import {useDispatch, useSelector} from 'react-redux';
import color from '../../styles/color';
import {launchImageLibrary} from 'react-native-image-picker';
import newrecipeStyle from './newrecipeStyle';
import {
  REMOVE_RECIPE_STEP,
  REPLACE_RECIPE_STEP,
} from '../../actions/recipeActions';
import GoButton from '../../components/goButton';

export default function NewStep({navigation, route}) {
  const {index} = route.params;
  const dispatch = useDispatch();
  const steps = useSelector(state => state.recipeReducer.recipeStepsReducer);
  const [stepImage, setStepImage] = useState('');
  const [step, setStep] = useState('');
  const [time, setTime] = useState(0);
  const [ingredients, setIngredients] = useState([
    'Apple',
    'Banana',
    'Pickles',
  ]);

  useEffect(() => {
    console.log(steps[index]);
    setStepImage(steps[index].image_cache ? steps[index].image_cache : null);
    setStep(steps[index].step_text ? steps[index].step_text : '');
    setTime(steps[index].step_time ? steps[index].step_time : 0);
    setIngredients(steps[index].step_ingredients ? steps[index].step_ingredients : []);
  }, [steps]);

  function save() {
    if (stepImage !== '') {
      const uploadUri =
        Platform.OS === 'ios'
          ? stepImage.uri.replace('file://', '')
          : stepImage.uri;

      const storageRef = storage()
        .ref()
        .child('Steps')
        .child(`${uuidv4()}.jpeg`);

      storageRef
        .putFile(uploadUri, {
          customMetadata: {
            Owner: auth().currentUser.uid,
          },
        })
        .then(() => {
          console.log('Uploaded');
          const stepObj = {
            step_index: index,
            step_image: storageRef.toString(),
            step_text: step,
            step_time: time,
            step_ingredients: ingredients,
            image_cache: stepImage,
          };
          dispatch({
            type: REPLACE_RECIPE_STEP,
            payload: {
              index: index,
              step: stepObj,
            },
          });
          navigation.replace('NewRecipe');
        });
    } else {
      console.log('Image Cannot Be Empty');
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        style={{paddingHorizontal: '5%'}}
        contentContainerStyle={{paddingBottom: '50%'}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            height: 50,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              navigation.pop();
            }}>
            <Image
              source={require('../../assets/Back.png')}
              style={{
                width: 24,
                height: 24,
                resizeMode: 'contain',
                tintColor: color.black,
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              flex: 2,
              color: color.textGray,
              fontSize: 18,
              textAlign: 'center',
            }}>
            Step {index + 1}
          </Text>
          <TouchableOpacity
            style={{flex: 1, alignItems: 'flex-end'}}
            onPress={() => {
              save();
            }}>
            <Text style={{fontSize: 20}}>Save</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{
              aspectRatio: 1,
              marginTop: '5%',
              width: '100%',
              backgroundColor: color.gray,
              borderRadius: 20,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              padding: stepImage !== '' ? 0 : 20,
            }}
            onPress={() => {
              launchImageLibrary({
                selectionLimit: 1,
                mediaType: 'photo',
                includeBase64: false,
              }).then(res => {
                setStepImage({uri: res?.assets[0].uri});
              });
            }}>
            <Image
              source={
                stepImage !== '' ? stepImage : require('../../assets/Logo.png')
              }
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 20,
                resizeMode: stepImage !== '' ? 'cover' : 'contain',
              }}
            />
            <Image
              source={require('../../assets/EditStep.png')}
              style={[
                newrecipeStyle.EditStepIcon,
                {
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 30}}>
          <Text style={{fontSize: 18, fontWeight: '600'}}>Instruction</Text>
          <TextInput
            style={{
              marginTop: 10,
              minHeight: 100,
            }}
            value={step}
            onChangeText={text => {
              setStep(text);
            }}
            placeholder="Write the step here..."
            multiline
          />
        </View>
        <View
          style={{marginTop: 30, flexDirection: 'row', alignItems: 'flex-end'}}>
          <Text style={{fontSize: 18, fontWeight: '600'}}>Time</Text>
          <TextInput
            style={{
              borderBottomWidth: 1,
              borderColor: color.gray,
              width: 50,
              textAlign: 'center',
              marginLeft: 10,
              fontSize: 16,
            }}
            value={time.toString()}
            onChangeText={text => {
              setTime(Number(text));
            }}
            keyboardType="number-pad"
            placeholder="10"
            returnKeyType="done"
          />
          <Text
            style={{fontSize: 16, fontWeight: '600', color: color.textGray}}>
            mins
          </Text>
        </View>
        <View style={{marginTop: 30}}>
          <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 10}}>
            Ingredients
          </Text>
          {ingredients.map((ingredient, index) => {
            return (
              <TouchableOpacity
                key={ingredient}
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => {
                  ingredients.splice(index, 1);
                  setIngredients([...ingredients]);
                }}>
                <Text style={{fontSize: 18}}>{ingredient}</Text>
                <Image
                  source={require('../../assets/X.png')}
                  style={{
                    height: 16,
                    width: 16,
                    resizeMode: 'contain',
                    margin: 10,
                    tintColor: color.black,
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{marginTop: 30}}>
          {GoButton('Remove Step', () => {
            dispatch({
              type: REMOVE_RECIPE_STEP,
              payload: {
                index: index,
              },
            });
            navigation.replace('NewRecipe');
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
