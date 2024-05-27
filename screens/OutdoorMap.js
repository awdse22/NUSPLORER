import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, Image, TouchableWithoutFeedback, 
  Keyboard
} from 'react-native';

export default function OutdoorMap() {
  const navigation = useNavigation();

  function handleSearch() {
      // placeholder
      console.log('Search button pressed');
  }
  
  const SearchBar = () => {
      const [searchInput, setSearchInput] = useState('');
      return (
          <View style={styles.searchBar.container}>
              <TextInput 
                  onChangeText={setSearchInput}
                  value={searchInput}
                  style={styles.searchBar.input}
                  placeholder='Search' />
              <Button title='Search' onPress={handleSearch} />
          </View>  
      );
  };

  const UIButton = ({ name, icon, onPress }) => {
      return (
          <View style={styles.uiBar.buttonContainer}>
              <View style={styles.uiBar.buttonDisplay}>
                  <TouchableOpacity onPress={onPress}>
                  <Image 
                      source={icon}
                      style={styles.uiBar.buttonImage} 
                      resizeMode='contain' />
                  <Text style={styles.uiBar.buttonText}>{name}</Text>
                  </TouchableOpacity>
              </View>
          </View>
      )
  }

  const UIBar = () => {
      return (
          <View style={styles.uiBar.container}>
              <UIButton name='Navigate' icon={require('../assets/navigate-icon.png')}
                  onPress={() => console.log('Navigate button pressed')} />
              <UIButton name='Indoor Map' icon={require('../assets/map-icon.png')}
                  onPress={() => console.log('Indoor map button pressed')} />
              <UIButton name='Bookmarks' icon={require('../assets/bookmark-icon.png')}
                  onPress={() => console.log('Bookmarks button pressed')} />
              <UIButton name='Timetable' icon={require('../assets/timetable-icon.png')}
                  onPress={() => console.log('Timetable button pressed')} />
              <UIButton name='Settings' icon={require('../assets/settings-icon.png')}
                  onPress={() => console.log('Settings button pressed')} />
          </View>
      );
  }

  return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.mainUIContainer}>
              <SearchBar />
              <Text>Insert map here</Text>
              <Button title='logout' onPress={() => navigation.navigate('Login')}/>
          </View>
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
    container: {
      paddingTop: 0,
      flexDirection: 'column',
      flex: 1,
      borderWidth: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    // Outdoor Map
    mainUIContainer: {
      paddingTop: 20,
      flexDirection: 'column',
      flex: 1,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    searchBar: {
      container: {
        padding: 6,
        borderWidth: 1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: '#ededed'
      },
      input: {
        flex: 1,
        height: 50,
        fontSize: 25,
      }
    },
    uiBar: {
      container: {
        padding: 0,
        flexDirection: 'row',
        height: 100,
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: '#c7fffc',
  
      },
      buttonContainer: {
        width: '20%',
        height: '100%',
        padding: 3,
        borderWidth: 1
      },
      buttonDisplay: {
        borderWidth: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      },
      buttonImage: {
        height: '70%',
      },
      buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12
      }
    },
});