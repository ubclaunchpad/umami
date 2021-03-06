import React, { useEffect, useRef, useMemo } from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Dimensions,
  ImageBackground
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {PUT_USER} from '../../actions/accountActions';
import {GET_FEED, REPLACE_FEED} from '../../actions/feedActions';
import color from '../../styles/color';
import feedStyle from './feedStyle';
import FilterChips from '../../components/filterChips';
import GoButton from '../../components/goButton';
import Loader from '../../components/Loader';
import { SET_ALERT, SET_LOADING } from '../../actions/globalActions';
import { GET_NOTIFICATIONS } from '../../actions/profileActions';
import Alerts from '../../components/Alerts';
import { Chip } from 'react-native-paper';

export default function Feed({ navigation }) {
  const dispatch = useDispatch();
  const onboarded = useSelector(state => state.globalReducer.onboardReducer);
  const user = useSelector(state => state.accountReducer.userInfoReducer);
  const featuredFeed = useSelector(
    state => state.recipeReducer.featureFeedReducer,
  );
  const forYouFeed = useSelector(
    state => state.recipeReducer.forYouFeedReducer,
  );
  const loading = useSelector(state => state.globalReducer.loadingReducer);
  const alert = useSelector(state => state.globalReducer.alertReducer);
  const bottomSheetRef = useRef(null);
  const flatListRef = useRef(null);
  const snapPoints = useMemo(() => ['80%'], []);

  useEffect(() => {
    if (user && user.user_id !== '') {
      dispatch({type: SET_LOADING, loading: true});
      dispatch({type: GET_FEED, user: user, startIndex: forYouFeed.length});
    }
  }, [user]);

  if (!onboarded) {
    navigation.replace('ShoppingStyle');
  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        {Alerts(alert, "Feed Error")}
        {Loader(loading, 'fade')}
        <FlatList
          ref={flatListRef}
          data={forYouFeed}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <Image
                source={require('../../assets/Logo.png')}
                style={{
                  width: '35%',
                  resizeMode: 'contain',
                  marginHorizontal: '5%',
                  height: 50,
                }}
              />
              <View
                style={{
                  marginHorizontal: '5%',
                  width: '90%',
                  marginVertical: 15,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: color.lightGray,
                    height: 40,
                    width: '85%',
                    borderRadius: 20,
                    paddingHorizontal: '5%',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    dispatch({type: SET_ALERT, alert: false});
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
                <TouchableOpacity
                  onPress={() => {
                    bottomSheetRef.current.snapToIndex(0);
                  }}>
                  <Image
                    source={require('../../assets/Filter.png')}
                    style={{
                      height: 30,
                      width: 30,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <Text style={feedStyle.feedTitle}>Featured</Text>
                <FlatList
                  data={featuredFeed}
                  style={{marginBottom: 30}}
                  contentContainerStyle={{paddingLeft: '5%'}}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.push('Recipe', { recipe: item });
                        }}
                        style={{
                          width: Dimensions.get('screen').width * 0.8,
                          height: 250,
                          borderRadius: 20,
                          marginRight: 10,
                        }}>
                        <ImageBackground
                          source={{ uri: item.header_image }}
                          resizeMode="cover"
                          borderRadius={20}
                          style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: 'flex-end',
                          }}>
                          <View
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              height: '20%',
                              paddingHorizontal: '3%',
                              paddingVertical: 10,
                              borderBottomRightRadius: 20,
                              borderBottomLeftRadius: 20,
                            }}>
                            <Text
                              style={{
                                color: color.white,
                                fontWeight: 'bold',
                                fontSize: 16,
                              }}>
                              {item.name}
                            </Text>
                          </View>
                        </ImageBackground>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={item => item.recipe_id}
                />
              </View>
              <Text style={feedStyle.feedTitle}>For You</Text>
            </View>
          }
          onResponderEnd={() => {
            bottomSheetRef.current.close();
          }}
          numColumns={2}
          onEndReached={() => {
            dispatch({
              type: GET_FEED,
              user: user,
              startIndex: forYouFeed.length,
            });
          }}
          onEndReachedThreshold={0.2}
          contentContainerStyle={{ paddingBottom: '15%' }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.push('Recipe', { recipe: item });
                }}
                style={{
                  width: '44%',
                  aspectRatio: 1,
                  borderRadius: 20,
                  marginBottom: 10,
                  marginLeft: index % 2 === 0 ? '5%' : 0,
                  marginRight: index % 2 === 0 ? 0 : '5%',
                }}>
                <ImageBackground
                  source={{ uri: item.header_image }}
                  resizeMode="cover"
                  borderRadius={20}
                  style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      height: '30%',
                      paddingHorizontal: '3%',
                      paddingVertical: 10,
                      borderBottomRightRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}>
                    <Text
                      style={{
                        color: color.white,
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}>
                      {item.name}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.recipe_id}
        />
        <BottomSheet
          ref={bottomSheetRef}
          enablePanDownToClose={true}
          index={-1}
          snapPoints={snapPoints}>
          <View style={{flex: 1, paddingHorizontal: '7%', alignItems: 'flex-start'}}>
            <Text style={feedStyle.filterTitle}>Refine Results</Text>
            <Chip
            key={"Preference"}
            onPress={() => {
              dispatch({type: REPLACE_FEED, payload: []});
              dispatch({
                type: PUT_USER,
                payload: {...user, recipe_driven: !user.recipe_driven},
              });
            }}
            selectedColor={color.appPrimary}
            style={[
              {
                marginRight: 10,
                marginBottom: 15,
                borderRadius: 50,
                height: 40,
              },
              {
                backgroundColor: !user.recipe_driven ? color.appPrimary : null,
              },
            ]}
            textStyle={[
              {
                fontSize: 18,
                paddingHorizontal: 8,
                paddingVertical: 5,
              },
              {
                color: !user.recipe_driven ? color.white : color.textGray,
              },
            ]}>
            Only Recipes I Have Ingredients For
          </Chip>
            {FilterChips()}
            <View style={{flex: 3, width: '100%'}}>
              {GoButton('Save', () => {
                dispatch({
                  type: PUT_USER,
                  payload: {
                    ...user,
                  },
                });
                bottomSheetRef.current.close();
              })}
            </View>
          </View>
        </BottomSheet>
      </SafeAreaView>
    );
  }

  return null;
}
