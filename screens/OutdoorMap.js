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

  return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.mainUIContainer}>
              <SearchBar />
              <Text>Insert map here</Text>
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
});