import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {FlatGrid, SectionGrid} from 'react-native-super-grid';

const getCategory =
  'http://myvbox.uk:2052/player_api.php?username=test&password=test1&action=get_vod_categories';

const getMovieList =
  'http://myvbox.uk:2052/player_api.php?username=test&password=test1&action=get_vod_streams';

export const getImageUrl = imageUrl => {
  if (typeof imageUrl == 'string' && imageUrl.length > 0) return imageUrl;
  else
    return 'https://media.gettyimages.com/id/1282664101/photo/low-angle-view-of-historical-building-against-sky.jpg?s=612x612&w=gi&k=20&c=1soD6uRTARckGYrraGyyC5t1eJQoxThsG-_9Wyb4XY0=';
};

const MainList = ({navigation}) => {
  const [dataList, setDataList] = useState([]);

  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    handleList();
  }, []);

  const getMoviesListFun = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(getMovieList, {
          method: 'GET',
        });
        const responseJson = await response.json();
        // console.log('responseJson ::',responseJson)
        resolve(responseJson);
      } catch (error) {
        reject(error);
        console.log('error', error);
      }
    });
  }, []);

  const handleListManage = useCallback((categoryArray, movieArray) => {
    let len = categoryArray.length;
    const tempArray = movieArray;
    const myArray = [];

    for (let i = 0; i < len; i++) {
      let myObj = {
        title: categoryArray[i].category_name,
        data: [],
      };
      for (let j = 0; j < tempArray.length; j++) {
        if (categoryArray[i]['category_id'] === tempArray[j]['category_id']) {
          myObj.data.push(movieArray[j]);
        }
      }
      myArray.push(myObj);
    }
    setDataList(myArray);
    setLoading(false);
  }, []);
  const handleList = () => {
    Promise.all([getMoviesListFun()])
      .then(async data => {
        try {
          const response = await fetch(getCategory, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
            },
          });
          const responseJson = await response.json();
          handleListManage(responseJson, data[0]);
        } catch (error) {
          console.log('error', error);
        }
      })
      .catch(error => {
        console.log('error :', error);
      });
  };

  const renderItemHeader = useCallback(({item, index}) => {
    return (
      <View key={index} style={{width: 150}}>
        <FastImage
          defaultSource={{
            uri: getImageUrl(''),
          }}
          style={styles.imageStyle}
          source={{
            uri: getImageUrl(item.stream_icon),
          }}
        />
        <View style={{marginTop: 10}}>
          <Text style={styles.movieName}>{item.name}</Text>
        </View>
      </View>
    );
  }, []);

  const renderItem = useCallback(({item, index}) => {
    return (
      <View key={index} style={{width: 90}}>
        <FastImage
          defaultSource={{
            uri: getImageUrl(''),
          }}
          style={{...styles.imageStyle, width: 90, height: 100}}
          source={{
            uri: getImageUrl(item.stream_icon),
          }}
        />
        <View style={{marginTop: 10}}>
          <Text style={styles.movieName}>{item.name}</Text>
        </View>
      </View>
    );
  }, []);

  const onClickHandler = (index = 0) => {
    navigation.navigate('MovieList', dataList[index]);
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.screen,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <View>
          <ActivityIndicator color={'#fff'} size={30} />
          <Text style={styles.titleStyle}>...Loading</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      <ScrollView style={{marginTop: 20, marginHorizontal: 15}}>
        {dataList.slice(0, 1).map((item, index) => {
          return (
            <View key={index}>
              <View style={styles.titleSection}>
                <Text style={styles.titleStyle}>{item.title}</Text>
                <TouchableOpacity onPress={() => onClickHandler(index)} s>
                  <Text style={styles.seeMoreText}>See More</Text>
                </TouchableOpacity>
              </View>
              <View>
                <FlatList
                  data={item.data.slice(0, 10)}
                  horizontal
                  renderItem={renderItemHeader}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={() => <View style={{width: 20}} />}
                />
              </View>
            </View>
          );
        })}
        <View style={{marginTop: 20}}>
          {dataList
            .filter((item, i) => i != 0)
            .map((item, index) => {
              return (
                <View key={index}>
                  <View style={styles.titleSection}>
                    <Text style={styles.titleStyle}>{item.title}</Text>
                    <TouchableOpacity onPress={() => onClickHandler(index + 1)}>
                      <Text style={styles.seeMoreText}>See More</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{marginBottom: 20}}>
                    <FlatList
                      data={item.data.slice(0, 10)}
                      horizontal
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
                      ItemSeparatorComponent={() => (
                        <View style={{width: 20}} />
                      )}
                    />
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};

export default MainList;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101010',
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  titleStyle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  seeMoreText: {
    color: '#fff',
    fontSize: 16,
  },
  imageStyle: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  movieName: {
    color: '#fff',
    fontSize: 13,
  },
});
