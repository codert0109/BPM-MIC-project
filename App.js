import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Button } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import Video from 'react-native-video';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { groupBy } from 'lodash';
let timerHandler = null;
let gTime = 0.0;
let gRate = 0.0;

const { width, height } = Dimensions.get('screen');

const fetchDataMock = {
  Auth: 'OK',
  Videos: [
    {
      Vid: 'https://somusix.com/media/rec_videos/vids/Ballerina_240_FPS.mp4',
      Img: 'https://somusix.com/media/rec_videos/imgs/MissedNuance240FPS-Thumbnail.jpg',
      VidID: '100',
      TargetFPS: '240',
      MinBPM: '30',
      MaxBPM: '300',
      TargetBPM: '120',
      StartFPS: '240',
      StopFPS: '5',
      BPMEvaluationWindowMaxSec: '5',
      RelativePeakThreshold: '1.5',
      MicNoisefloor: '0.15',
    },
    {
      Vid: 'https://somusix.com/media/rec_videos/vids/Ballerina_120_FPS.mp4',
      Img: 'https://somusix.com/media/rec_videos/imgs/MissedNuance120FPS-Thumbnail.jpg',
      VidID: '101',
      TargetFPS: '120',
      MinBPM: '30',
      MaxBPM: '300',
      TargetBPM: '120',
      StartFPS: '120',
      StopFPS: '4',
      BPMEvaluationWindowMaxSec: '5',
      RelativePeakThreshold: '1.5',
      MicNoisefloor: '0.15',
    },
    {
      Vid: 'https://somusix.com/media/rec_videos/vids/Ballerina_60_FPS.mp4',
      Img: 'https://somusix.com/media/rec_videos/imgs/MissedNuance60FPS-Thumbnail.jpg',
      VidID: '102',
      TargetFPS: '60',
      MinBPM: '30',
      MaxBPM: '300',
      TargetBPM: '120',
      StartFPS: '60',
      StopFPS: '3',
      BPMEvaluationWindowMaxSec: '5',
      RelativePeakThreshold: '1.5',
      MicNoisefloor: '0.15',
    },
    {
      Vid: 'https://somusix.com/media/rec_videos/vids/Ballerina_30_FPS.mp4',
      Img: 'https://somusix.com/media/rec_videos/imgs/MissedNuance30FPS-Thumbnail.jpg',
      VidID: '103',
      TargetFPS: '30',
      MinBPM: '30',
      MaxBPM: '300',
      TargetBPM: '120',
      StartFPS: '30',
      StopFPS: '2',
      BPMEvaluationWindowMaxSec: '5',
      RelativePeakThreshold: '1.5',
      MicNoisefloor: '0.15',
    },
  ],
};

const speedDropdownData = [
  { label: '0.25x', value: 0.25 },
  { label: '0.50x', value: 0.50 },
  { label: '0.75x', value: 0.75 },
  { label: '1.00x', value: 1.00 },
  { label: '1.25x', value: 1.25 },
  { label: '1.50x', value: 1.50 },
  { label: '1.75x', value: 1.75 },
  { label: '2.00x', value: 2.00 },
];

let accN = 1.0;

export default function App() {
  const [videoItems, setVideoItems] = useState([]);
  const [indexVideo, setIndexVideo] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFocus, setIsFocus] = useState(false);
  const [rate, setRate] = useState(0);
  const videoRef = React.useRef();
  const timeTextRef = React.useRef();
  const rateTextRef = React.useRef();

  useEffect(() => {
    const url = 'https://somusix.com/rec_videos.php';

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setVideoItems(json.Videos);
        setIsLoading(false);
      } catch (error) {
        console.log('error', error);
        alert('something wrong, please retry');
        setVideoItems(fetchDataMock.Videos);
        setIsLoading(false);
      }
    };

    fetchData();
    timeTextRef.current?.setNativeProps({ text: gTime.toFixed(2) });
    rateTextRef.current?.setNativeProps({ text: rate.toFixed(2) });

    return () => clearInterval(timerHandler);
  }, []);

  const speedTimer = () => {
    if (isLoading) return;
    clearInterval(timerHandler);
    gTime = 0;
    gRate = 0;
    toggleVideoSpeed();
    timerHandler = setInterval(() => {
      gTime += 0.1;
      timeTextRef.current?.setNativeProps({ text: gTime.toFixed(2) + '' });
    }, 100);
    setTimeout(() => {
      gTime = 20.0;
      timeTextRef.current?.setNativeProps({ text: gTime.toFixed(2) + '' });
      clearInterval(timerHandler);
    }, 20000)
    setTimeout(() => {     // 3s
      gRate = 1.0;
      toggleVideoSpeed();
      let timer1 = setInterval(() => {     // 3 - 5s
        gRate += 0.05 * accN;
        toggleVideoSpeed();
      }, 100 * accN * 100 * 5);

      setTimeout(() => {
        gRate = 2.0;
        toggleVideoSpeed();
        clearInterval(timer1);
        let timer2 = setInterval(() => {     // 5 - 10s
          gRate -= 0.04 * accN;
          toggleVideoSpeed();
        }, 100 * accN * 100 * 5);

        setTimeout(() => {
          gRate = 0;
          toggleVideoSpeed();
          clearInterval(timer2);
          setTimeout(() => {     // 13s
            gRate = 1.0;
            toggleVideoSpeed();
            let timer3 = setInterval(() => {        // 13 - 18s
              gRate -= 0.015 * accN;
              toggleVideoSpeed();
            }, 100 * accN * 100 * 5)

            setTimeout(() => {         // 18s
              gRate = 0.25;
              toggleVideoSpeed();
              clearInterval(timer3);
              let timer4 = setInterval(() => {   //18 - 20s
                gRate -= 0.0125 * accN;
                toggleVideoSpeed();
              }, 100 * accN * 100 * 5);

              setTimeout(() => {         //20s
                clearInterval(timer4);
                gRate = 0;
                toggleVideoSpeed();
                speedTimer();
              }, 2000)
            }, 5000)
          }, 3000)
        }, 5000)
      }, 2000)
    }, 3000)
  }

  const toggleVideoSpeed = () => {
    rateTextRef.current.setNativeProps({
      text: gRate.toFixed(2) + ''
    })
    setRate(gRate);
    return;
    videoRef.current.setNativeProps({
      rate: gRate
    })
  }

  const setText = (_rate = 0) => {
    // this.rateTextRef.current?.setNativeProps({ text: _rate.toFixed(1) + '' });
  }

  const onSelectMenu = index => {
    setIndexVideo(index);
  };

  const onReadyForDisplayVideo = () => { };

  const onLoadStartVideo = () => { };

  const onEndVideo = () => { };

  const onLoadVideo = () => { };

  const onSpeedControl = direction => {
    if (direction == 1) {
      //UP
      setRate(rate + 0.1 > 1 ? 1 : rate + 0.1);
    } else {
      // DOWN
      setRate(rate - 0.1 < 0.1 ? 0.1 : rate - 0.1);
    }
  };

  const renderLabel = () => {
    if (rate || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Playback Speed
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={{ position: 'absolute', top: 40, fontSize: 40 }}>
        {'BPM MIC'}
      </Text>
      <ActivityIndicator
        size="large"
        color="red"
        style={isLoading ? styles.loading : styles.loadingFalse}
      />
      <Video
        source={{
          // uri: 'https://www.w3schools.com/html/mov_bbb.mp4',
          uri: videoItems[indexVideo]?.Vid,
        }}
        // source={require('./assets/movie.mp4')}
        style={{
          width: width,
          aspectRatio: 1,
          // opacity: 0.2,
          top: '20%',
          position: 'absolute'
        }}
        ref={ref => videoRef.current = ref}
        controls={true}
        paused={false}
        onReadyForDisplay={() => {
          console.log('ready for display');
          // setIsLoading(false);
        }}
        repeat={true}
        onEnd={() => {
          console.log('onend');
          // setIndexVideo(indexVideo + 1 == 4 ? 0 : indexVideo + 1);
          // setIsLoading(true);
        }}
        onLoad={() => {
          console.log('load stop');
          setIsLoading(false);
        }}
        onLoadStart={() => {
          console.log('onload start');
          setIsLoading(true);
        }}
        rate={rate}
      />
      <View style={{position: 'absolute', bottom: 100, flexDirection: 'column'}}>
        <View style={{ marginTop: -20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text>Speed: </Text>
        <TextInput ref={ref => rateTextRef.current = ref} editable={false} style={{ color: 'black' }}
          selectTextOnFocus={false}>{ }</TextInput>
      </View>
      <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text>Time: </Text>
        <TextInput ref={ref => timeTextRef.current = ref} editable={false} style={{ color: 'black' }}
          selectTextOnFocus={false}>{ }</TextInput>
      </View>
      <Button onPress={() => speedTimer()} title="Start" disabled={isLoading}></Button>
      </View>
      {/* {isLoading ? null : (
        <View style={styles.containerOfDropdown}>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={speedDropdownData}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select item' : '...'}
            searchPlaceholder="Search..."
            value={rate}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setRate(item.value);
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? 'blue' : 'black'}
                name="setting"
                size={20}
              />
            )}
          />
        </View>
      )} */}
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#c2c9d6',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 0,
  },
  overlay: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    opacity: 1,
    width: width,
    height: '20%',
    backgroundColor: 'grey',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  menuItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#757575',
    borderWidth: 5,
    padding: 5,
    borderRadius: 10,
  },
  activeMenuItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#757575',
    borderWidth: 5,
    padding: 5,
    borderRadius: 10,
    borderColor: '#04364e',
    backgroundColor: '#1a73e8',
  },
  speedButton: {
    width: 40,
    height: 20,
    backgroundColor: 'blue',
    marginHorizontal: 10,
  },
  loading: {
    position: 'absolute',
    zIndex: 1030,
    color: 'red',
  },
  loadingFalse: {
    zIndex: -1,
    display: 'none',
  },
  containerOfDropdown: {
    marginTop: 32,
    padding: 8,
  },
  dropdown: {
    height: 50,
    width: 150,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginLeft: 20,
    marginRight: 10,
  },
  label: {
    position: 'absolute',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
