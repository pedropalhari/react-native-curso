/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import Sound from 'react-native-sound'; //adicionar lib

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {width, height} from 'react-native-dimension';

import React, {useEffect, useState} from 'react';

function InstantList(props) {
  return (
    <View>
      {props.list.map(res => (
        <TouchableOpacity
          key={res.link}
          style={{
            width: 200,
            height: 100,
            borderRadius: 30,
            backgroundColor: 'red',

            marginTop: 10,
            marginBottom: 10,

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
          onPress={async () => {
            let link = res.link;

            while (link.indexOf("'") != -1) link = link.replace("'", '');

            let encodedLink = encodeURIComponent(link);

            console.log(`http://192.168.0.113:3050/resolve/${encodedLink}`);

            let result = await fetch(
              `http://192.168.0.113:3050/resolve/${encodedLink}`,
            );

            let resObject = await result.json();

            console.log(resObject);

            let track = new Sound(
              `https://www.myinstants.com/media/sounds/${resObject.name}`,
              null,
              e => {
                if (e) {
                  console.log('error loading track:', e);
                } else {
                  track.play();
                }
              },
            );
          }}>
          <Text>{res.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function App() {
  let [searchText, setSearchText] = useState('');

  let [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    (async () => {
      let result = await fetch(
        `http://192.168.0.113:3050/search/${searchText}`,
      );
      let resultText = await result.json();

      setSearchResult(resultText);
    })();
  }, [searchText]);

  return (
    <View
      style={{
        width: width(100), //aqui
        height: height(100),
        backgroundColor: '#f6f078',
        overflowX: 'hidden',

        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
      <TextInput
        value={searchText}
        onChangeText={text => setSearchText(text)}
        style={{
          width: 300,
          height: 50,
          fontSize: 22,
          backgroundColor: 'white',
          marginTop: 30,
        }}></TextInput>

      <InstantList list={searchResult} />
    </View>
  );
}

export default App;
