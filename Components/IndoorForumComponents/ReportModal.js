import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const reportReasons = [
  {
    label: 'Content is inappropriate, offensive or irrelevant',
    value: 'Inappropriate/Offensive/Irrelevant',
  },
  {
    label: 'Inaccurate/Outdated content',
    value: 'Inaccurate/Outdated',
  },
];

function dummyRefresh() {
  console.log('Should be refreshing page');
}

export default function ReportModal({ 
  modalVisible, closeModal, contentId, contentType, refreshPage = dummyRefresh }) {
  const navigation = useNavigation();
  const [reason, setReason] = useState(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sendingReport, setSendingReport] = useState(false);
  
  async function report() {
    const token = await AsyncStorage.getItem('token');
    const url = `http://10.0.2.2:3000/report/${contentId}`;
    if (reason) {
      setSendingReport(true);
      try {
        const response = await axios.post(url, {
          contentType: contentType,
          reason: reason
        }, { 
          headers: {
            'Authorization': token ? `Bearer ${token}` : null
          }
        })

        if (response.data.contentDeleted) {
          Alert.alert(
              'Report successful', 
              `Due to a large amount of reports, the ${contentType} has been removed`
          );
        } else {
          Alert.alert(
            'Report successful', 
            `Your report for this ${contentType} has been made successfully`
          );
        }
        refreshPage();
        setSendingReport(false);
        close();
      } catch (error) {
        const errorStatus = error.response.status;
        const errorMessage = error.response.data.error;
        if (errorStatus == 400) {
          Alert.alert(errorMessage);
        } else if (errorStatus == 401 || errorStatus == 403) {
          Alert.alert(errorMessage, 'Please login again!', [
            {
              text: 'OK',
              onPress: () => {
                AsyncStorage.removeItem('token');
                navigation.navigate('Login');
                console.log('Token cleared and navigated to Login');
              }
            }
          ]);
        } else if (errorStatus == 404) {
          Alert.alert('Data not found', errorMessage);
          refreshPage();
        } else if (errorStatus == 500) {
          Alert.alert(
            `Failed to report ${contentType}`,
            `An error occurred in the server while reporting ${contentType}`
          );
          console.log(`Error making report: `, errorMessage);
        } else {
          Alert.alert(
            `Failed to report ${contentType}`,
            `An unknown error occurred while reporting ${contentType}`
          );
          console.log(`Error making report: `, errorMessage);
        }
        setSendingReport(false);
      }
    } else {
      setErrorVisible(true);
      setErrorMessage('You need to select a reason!');
    }
  }

  function close() {
    setErrorMessage('');
    setErrorVisible(false);
    closeModal();
  }
  return (
    <Modal visible={modalVisible} animationType='fade' transparent={true}>
      <View style={styles.container}>
        <View style={styles.window}>
          <View style={styles.subContainer}>
            <Text style={styles.titleText}>
              Report {contentType}
            </Text>
          </View>
          <Dropdown 
            style={styles.dropdown.container}
            placeholder='Select reason'
            labelField='label'
            valueField='value'
            data={reportReasons}
            onChange={item => setReason(item.value)}
            maxHeight={300}
            renderItem={item => {
              return (
                <View style={styles.dropdown.itemContainer}>
                  <Text style={styles.dropdown.itemText}>
                    {item.label}
                  </Text>
                  {item.value == reason && (
                    <AntDesign 
                      name="check" 
                      size={22} 
                      color="black" 
                    />
                  )}
                </View>
              )
            }}
          />
          {errorVisible && (
            <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold'}}>
              {errorMessage}
            </Text>
          )}
          {sendingReport ? (
            <ActivityIndicator 
              animating={true} 
              size='large' 
              color='#003db8'
              style={{ padding: 22 }} 
            />
          ) : (
            <View style={styles.subContainer}>
              <TouchableOpacity style={styles.buttonContainer} onPress={report}>
                <Text style={styles.buttonText}>Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={close}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  window: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 22,
    flexDirection: 'row',
  },
  titleText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
  },
  buttonContainer: {
    width: 90,
    margin: 10,
    padding: 10,
    backgroundColor: '#2164cf',
    borderWidth: 0.5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdown: {
    container: {
      margin: 16,
      height: 65,
      backgroundColor: '#f2f2f2',
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 10,
      padding: 8,
      width: '90%',
    },
    itemContainer: {
      borderWidth: 0.5,
      borderColor: 'grey',
      padding: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemText: {
      flex: 1,
      fontSize: 16,
    },
  },
});
