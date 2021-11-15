import React, {useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  SectionList,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Swipeable from 'react-native-swipeable';
import SwitchSelector from 'react-native-switch-selector';
import {useDispatch, useSelector} from 'react-redux';
import color from '../../styles/color';
import {
  ADD_INGREDIENT,
  GET_ALL_INGREDIENTS,
  REMOVE_INGREDIENT,
} from '../../actions/pantryActions';

export default function EditPantry({navigation}) {
  const dispatch = useDispatch();
  const [addState, setAddState] = useState(true);
  const pantry = useSelector(state => state.pantryReducer.pantryReducer);
  const ingredients = useSelector(
    state => state.pantryReducer.ingredientReducer,
  );

  useEffect(() => {
    dispatch({type: GET_ALL_INGREDIENTS});
  }, [dispatch]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{flex: 1, marginLeft: 20}}
          onPress={() => {
            navigation.pop();
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
        <View style={{flex: 5}}>
          <SwitchSelector
            initial={0}
            onPress={value => setAddState(value)}
            backgroundColor={color.appPrimary}
            textColor={color.white}
            selectedColor={color.appPrimary}
            buttonColor={color.white}
            borderColor={color.appPrimary}
            hasPadding
            options={[
              {label: 'Add', value: true},
              {label: 'Remove', value: false},
            ]}
          />
        </View>
        <View style={{flex: 1, height: 1}} />
      </View>
      <View style={{flex: 10}}>
        {addState && (
          <FlatList
            style={{paddingHorizontal: '5%'}}
            data={ingredients}
            ListHeaderComponent={() => {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: color.lightGray,
                    height: 40,
                    width: '100%',
                    borderRadius: 20,
                    marginBottom: 20,
                    paddingHorizontal: '5%',
                    alignItems: 'center',
                    alignSelf: 'center',
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    navigation.push('Search');
                  }}>
                  <Image
                    source={require('../../assets/Search.png')}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{paddingBottom: '30%'}}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => {
              return (
                <View
                  style={{
                    height: 1,
                    backgroundColor: color.black75,
                    marginVertical: 20,
                  }}
                />
              );
            }}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 1,
                  }}>
                  <Text style={{fontSize: 18}}>{item[1]}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch({
                        type: ADD_INGREDIENT,
                        payload: {userID: auth().currentUser.uid, item: item},
                      });
                    }}>
                    <Image
                      source={require('../../assets/Plus.png')}
                      style={{
                        width: 24,
                        height: 24,
                        resizeMode: 'contain',
                        tintColor: color.gray,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        )}
        {!addState && (
          <SectionList
            sections={pantry}
            style={{paddingLeft: '5%', marginRight: '5%'}}
            ItemSeparatorComponent={() => {
              return (
                <View
                  style={{
                    height: 1,
                    backgroundColor: color.black75,
                  }}
                />
              );
            }}
            ListHeaderComponent={() => {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: color.lightGray,
                    height: 40,
                    width: '100%',
                    borderRadius: 20,
                    marginBottom: 20,
                    paddingHorizontal: '5%',
                    alignItems: 'center',
                    alignSelf: 'center',
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    navigation.push('Search');
                  }}>
                  <Image
                    source={require('../../assets/Search.png')}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              );
            }}
            renderItem={({item}) => {
              return (
                <Swipeable
                  rightButtons={[
                    <TouchableOpacity
                      style={{
                        backgroundColor: color.appPrimary,
                        height: '100%',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        dispatch({
                          type: REMOVE_INGREDIENT,
                          payload: {userID: auth().currentUser.uid, item},
                        });
                      }}>
                      <Image
                        source={require('../../assets/X.png')}
                        style={{
                          width: 16,
                          height: 16,
                          resizeMode: 'contain',
                          marginLeft: 30,
                        }}
                      />
                    </TouchableOpacity>,
                  ]}>
                  <Text
                    style={{
                      fontSize: 18,
                      marginVertical: 20,
                      marginLeft: 10,
                    }}>
                    {item.name}
                  </Text>
                </Swipeable>
              );
            }}
            contentContainerStyle={{paddingBottom: '30%'}}
            showsVerticalScrollIndicator={false}
            SectionSeparatorComponent={() => {
              return (
                <View
                  style={{
                    height: 1,
                  }}
                />
              );
            }}
            renderSectionHeader={({section: {title}}) => {
              return (
                <View>
                  <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                    {title}
                  </Text>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
