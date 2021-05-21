// Import React
import React, { useState, useEffect } from 'react';
// Import required components
import { SafeAreaView, StyleSheet, View, Button } from 'react-native';
// Import Map and Marker
import MapView, { Marker } from 'react-native-maps';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {getDistance} from 'geolib';
import { locations } from './Data/Data';

const App = () => {

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateFilter, setDateFilter] = useState(new Date());

  const [isMarkersSlected, setMarkersSlected] = useState(false);
  const [firstMarker, setFirstMarker] = useState(null);
  const [secondMarker, setSecondMarker] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDateFilter(date);
    hideDatePicker();
  };

  const getDate = (locationDate) => {
    var year = parseInt(locationDate.substring(0, 4));
    var month = parseInt(locationDate.substring(5, 7));
    var day = parseInt(locationDate.substring(8, 10));
    var hh = parseInt(locationDate.substring(11, 13));
    var mm = parseInt(locationDate.substring(14, 16));
    var ss = parseInt(locationDate.substring(17, 19));
    return new Date(year, month, day, hh, mm, ss);
  };

  const getColor = (coordinate) => {
    if (firstMarker != null && secondMarker != null) {
      if (coordinate.latitude == firstMarker.latitude && coordinate.longitude == firstMarker.longitude) {
        return 'green';
      }
      if (coordinate.latitude == secondMarker.latitude && coordinate.longitude == secondMarker.longitude) {
        return 'green';
      }
    }
    return 'red';
  };

  useEffect(() => {
    (() => {
      if (isMarkersSlected) {
        setMarkersSlected(false);
      }
      setMarkersSlected(true);
    })()
  }, [firstMarker, secondMarker]);

  const markerClick = (e) => {
  
    if (firstMarker == null) {
      setFirstMarker(e.coordinate);
    } 
    else if (firstMarker.latitude == e.coordinate.latitude && firstMarker.longitude == e.coordinate.longitude) {
      return null;
    } else {
      if (secondMarker == null) {
        setSecondMarker(e.coordinate);
      } else {
        setFirstMarker(secondMarker);
        setSecondMarker(e.coordinate);
      }
    }
  }

  const DistanceButton = () => {
    if (secondMarker !== null) {
      return <Button title="Calculate Distance" color="#ff5c5c" onPress={() => {
        var dis = getDistance(
          {latitude: firstMarker.latitude, longitude: firstMarker.longitude},
          {latitude: secondMarker.latitude, longitude: secondMarker.longitude},
        );
        alert(
          `Distance\n\n${dis} Meter\nOR\n${dis / 1000} KM`
        );
      }} />;
    }
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: 58.2456,
            longitude: 26.364,
            latitudeDelta: 0.3,
            longitudeDelta: 0.2,
          }}
        >
          {locations
            // filter by create date
            .filter(location => new Date(getDate(location.date_created)) - dateFilter > 0)
            .map(location => (
              <Marker
                key={location.id}
                coordinate={{
                  latitude: location.lat,
                  longitude: location.lng,
                }}
                pinColor={getColor({
                  latitude: location.lat,
                  longitude: location.lng,
                })}
                onPress={e => markerClick(e.nativeEvent)}
              />
            ))
          }
        </MapView>
        <View style={mainConatinerStyle}>
          <Button title="Date Filter" onPress={showDatePicker} />
          <DistanceButton/>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;

const mainConatinerStyle = [{
  flexDirection: 'column',
  flex: 1,
}, {
  floatingMenuButtonStyle: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 35
  }
}];

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});