import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, TouchableOpacity, Linking} from 'react-native';
import {screenName} from '@navigation/screenName';
import ListNewsScreen from '@screens/ListNewsScreen/ListNewsScreen';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from './styles';
import {colorGlobal, colorTabBar} from '@config/colorGlobal';
import HeaderBanner from '@components/HeaderComponent/HeaderBanner/HeaderBanner';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Actions} from '@store/actions';
import ViewLoadingComponent from '@components/ViewLoadingComponent/ViewLoadingComponent';
import {
  IHeaderComponentProps,
  IListTabState,
  IListNewsState,
  IListNewsCatsState,
  IDataBannerState,
} from './types';
import {IconMenu} from '@components/IconMenuComponent/IconMenu';
import {TabBarItem} from '@components/TabBarItemComponent/TabBarItem';
import {
  HEADER_MAX_HEIGHT,
  HEADER_MIN_HEIGHT,
  HEADER_SCROLL_DISTANCE,
} from '@constants/sizeDefault';
import ImageViewLoading from '@components/ImagePlaceholder/index';
import ImagePlaceholder from '@components/ImagePlaceholder/ImagePlaceholder';
import Banner from '@components/Banner/Banner';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  interpolateNode,
} from 'react-native-reanimated';
import {duration} from 'moment';
const HomeScreen = (props: IHeaderComponentProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute<any>();
  // const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [pressCats, setPressCats] = useState<boolean>(false);
  const [pageCurrent, setPageCurrent] = useState(2);
  const [idCatsCurrent, setIdCatsCurrent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataNews, setDataNews] = useState<any>(null);
  const [dataBanner, setDataBanner] = useState<any>(null);
  useEffect(() => {
    dispatch(Actions.getListTabRequest());
    dispatch(
      Actions.getListNewsRequestActions({
        limit: '20',
        page: '1',
      }),
    );
    dispatch(Actions.getBannerRequestActions());
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  }, []);
  useEffect(() => {
    if (route.params !== undefined) {
      setIdCatsCurrent(route.params.filters.News_Cats);
    }
  }, [route.params]);
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });
  const animatedStyles = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      {
        extrapolateRight: Extrapolate.CLAMP,
      },
    );

    return {
      // transform: [{scale: scale}],
      width: '100%',
      height: scale,
    };
  });

  const onPressCategories = async (item: any) => {
    let idCategories = item.id;
    if (item.id === 10000) idCategories = 0;
    await dispatch(
      Actions.getCatsListNewsRequestActions({
        filters: {News_Cat: idCategories},
        limit: '20',
        page: '1',
      }),
    );
    setPressCats(true);
    setPageCurrent(2);
    setIdCatsCurrent(idCategories);
  };
  const onLoadMore = () => {
    if (idCatsCurrent !== '') {
      if (pressCats) {
        dispatch(
          Actions.getMoreCatsListNewsRequestActions({
            filters: {News_Cat: idCatsCurrent},
            limit: '20',
            page: pageCurrent.toString(),
          }),
        );
        setPageCurrent(pageCurrent + 1);
        return;
      } else {
        dispatch(
          Actions.getCatsListNewsRequestActions({
            filters: {News_Cat: idCatsCurrent},
            limit: '20',
            page: pageCurrent.toString(),
          }),
        );
        setPageCurrent(pageCurrent + 1);
        return;
      }
    }
    if (pressCats) {
      dispatch(
        Actions.getMoreCatsListNewsRequestActions({
          limit: '20',
          page: pageCurrent.toString(),
        }),
      );
      setPageCurrent(pageCurrent + 1);
    } else {
      dispatch(
        Actions.getListNewsRequestActions({
          limit: '20',
          page: pageCurrent.toString(),
        }),
      );
      setPageCurrent(pageCurrent + 1);
    }
  };

  const listTabReducer = useSelector(
    (state: IListTabState) => state.listTabReducer,
  );
  const listNewsReducer = useSelector(
    (state: IListNewsState) => state.listNewsReducer,
  );
  const listNewsCatsReducer = useSelector(
    (state: IListNewsCatsState) => state.listNewsCatsReducer,
  );
  const bannerData = useSelector(
    (state: IDataBannerState) => state.bannerReducer,
  );
  const dataCategories = listTabReducer.data.data;
  const isLoadingListTab = listTabReducer.isLoading;
  const isLoadingListNews = listNewsReducer.isLoading;
  const dataListNews = listNewsReducer.data;
  const dataListNewsCats = listNewsCatsReducer.data;
  const isLoadingListNewsCats = listNewsCatsReducer.isLoading;
  const isLoadingMoreListNewsCats = listNewsCatsReducer.isLoadingMore;

  useEffect(() => {
    if (!isLoadingListNews) {
      setDataNews(dataListNews);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 550);
    }
  }, [isLoadingListNews]);

  // const headerHeight = scrollY.interpolate({
  //   inputRange: [0, HEADER_SCROLL_DISTANCE],
  //   outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
  //   extrapolate: 'clamp',
  // });
  const handlePress = useCallback(async (url: string) => {
    await Linking.openURL(url);
  }, []);

  return (
    <>
      {!isLoadingListTab && dataCategories ? (
        <View style={styles.container}>
          <View style={styles.viewHeader}>
            <Animated.View style={animatedStyles}>
              <TouchableOpacity
                style={styles.viewBanner}
                onPress={() => {
                  // onPressCategories({id: 10000});
                  const urlBanner = bannerData.dataBanner.top.link;
                  if (urlBanner !== '') handlePress(urlBanner);
                }}>
                {bannerData.dataBanner &&
                bannerData.dataBanner.top &&
                bannerData.dataBanner.top.image ? (
                  <HeaderBanner
                    imgBanner={{uri: bannerData.dataBanner.top.image}}
                  />
                ) : (
                  <HeaderBanner
                    imgBanner={require('../../assets/img/logoBanner.png')}
                  />
                )}
              </TouchableOpacity>
            </Animated.View>
            <View>
              <LinearGradient
                colors={colorTabBar}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.tabBar}>
                <TouchableOpacity
                  style={[styles.tabItem]}
                  onPress={() => {
                    navigation.navigate(screenName.MENU_SCREEN as never);
                  }}>
                  <IconMenu
                    img={{
                      uri: 'https://icon-library.com/images/menu-icon-png-3-lines/menu-icon-png-3-lines-5.jpg',
                    }}
                  />
                </TouchableOpacity>
                <FlatList
                  horizontal={true}
                  scrollEnabled={true}
                  data={dataCategories}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.viewTabBar}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => {
                    return (
                      <TabBarItem
                        name={item.name}
                        isFocus={item.isFocus}
                        onPress={() => {
                          onPressCategories(item);
                        }}
                      />
                    );
                  }}
                />
                <TouchableOpacity
                  style={[styles.tabItem]}
                  onPress={() => {
                    navigation.navigate(screenName.SEARCH_SCREEN as never);
                  }}>
                  <Icon
                    name="search"
                    size={30}
                    color={colorGlobal.iconSearchColor}
                    tvParallaxProperties={undefined}
                  />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
          {!isLoadingListNewsCats && dataNews !== null ? (
            <>
              <FlatList
                bounces={false}
                style={styles.containerBody}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={3}
                scrollEventThrottle={10}
                scrollEnabled={true}
                onScroll={e => (scrollY.value = e.nativeEvent.contentOffset.y)}
                // onScroll={Animated.event(
                //   [{nativeEvent: {contentOffset: {y: scrollY}}}],
                //   {useNativeDriver: false},
                // )}
                data={!pressCats ? dataNews.rows : dataListNewsCats.rows}
                onEndReached={({distanceFromEnd}) => {
                  if (distanceFromEnd < 50) return;
                  onLoadMore();
                }}
                ListFooterComponent={
                  isLoadingMoreListNewsCats ? <ImagePlaceholder /> : null
                }
                renderItem={({item}) => {
                  return <ListNewsScreen items={item} />;
                }}
              />
              {bannerData.dataBanner &&
                bannerData.dataBanner.bottom &&
                bannerData.dataBanner.bottom.length !== 0 && (
                  <Banner
                    imgBanner={{uri: bannerData.dataBanner.bottom.image}}
                    onPressLink={() =>
                      handlePress(bannerData.dataBanner.bottom.link)
                    }
                  />
                )}
            </>
          ) : (
            <ImageViewLoading />
          )}
        </View>
      ) : (
        <ViewLoadingComponent />
      )}
    </>
  );
};
export default HomeScreen;

// // import React from 'react';
// // import {View, StyleSheet, Dimensions} from 'react-native';
// // import Animated, {
// //   useSharedValue,
// //   useAnimatedScrollHandler,
// //   useAnimatedStyle,
// //   interpolate,
// //   Extrapolate,
// //   interpolateNode,
// // } from 'react-native-reanimated';

// // export const HEADER_IMAGE_HEIGHT = Dimensions.get('window').width / 3;

// // export default function Test() {
// //   const scrollY = useSharedValue(0);
// //   const scrollHandler = useAnimatedScrollHandler({
// //     onScroll: e => {
// //       scrollY.value = e.contentOffset.y;
// //     },
// //   });
// //   const animatedStyles = useAnimatedStyle(() => {
// //     const scale = interpolate(scrollY.value, [0, 55], [55, 0], {
// //       extrapolateRight: Extrapolate.CLAMP,
// //     });

// //     return {
// //       // transform: [{scale: scale}],
// //       width: '100%',
// //       height: scale,
// //     };
// //   });

// //   return (
// //     <View style={{flex: 1, alignItems: 'center'}}>
// //       <Animated.View
// //         style={[
// //           {
// //             position: 'absolute',
// //             top: 20,
// //             left: 0,
// //             width: 20,
// //             height: 20,
// //             backgroundColor: 'blue',
// //           },
// //           animatedStyles,
// //         ]}
// //       />

// //       <Animated.FlatList
// //         // scrollEventThrottle={1}
// //         style={StyleSheet.absoluteFill}
// //         onScroll={scrollHandler}></Animated.FlatList>
// //     </View>
// //   );
// // }
