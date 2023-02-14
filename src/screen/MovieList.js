import React, {useCallback} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SectionGrid} from 'react-native-super-grid';
import {getImageUrl} from './MainList';

const MovieList = props => {
  const {data, title} = props.route.params;
  const section = [
    {
      title: title,
      data: data,
    },
  ];
  const renderItem = useCallback(({item, index}) => {
    return (
      <View>
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
  return (
    <View style={styles.screen}>
      <View>
        <SectionGrid
          itemDimension={100}
          sections={section}
          maxItemsPerRow={2}
          renderItem={renderItem}
          renderSectionHeader={({section}) => (
            <Text
              style={{
                fontSize: 20,
                marginVertical: 10,
                color: '#fff',
                marginHorizontal: 10,
              }}>
              {section.title}
            </Text>
          )}
        />
      </View>
    </View>
  );
};

export default MovieList;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101010',
  },
  imageStyle: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },

  movieName: {
    color: '#fff',
    fontSize: 13,
  },
});
