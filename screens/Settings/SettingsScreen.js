import React, { useState, useEffect } from 'react';
import { Alert, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Dialog from 'react-native-dialog';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';
import { jwtDecode } from 'jwt-decode';

export default function SettingsScreen() {
  const navigator = useNavigation();
  const [username, setUsername] = useState('No data');
  const [email, setEmail] = useState('No data');
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  async function getUserDetails() {
    const token = await AsyncStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    const url = `http://10.0.2.2:3000/${userId}/userDetails`;

    axios
      .get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
        },
      })
      .then((response) => {
        const userData = response.data.userData;
        setEmail(userData.email);
        setUsername(userData.username);
        setErrorVisible(false);
        setErrorMessage('');
      })
      .catch((error) => {
        const errorStatus = error.response.status;
        if (errorStatus == 401 || errorStatus == 403) {
          Alert.alert(error.response.data.message, 'Please login again!', [
            {
              text: 'OK',
              onPress: () => logout(),
            },
          ]);
        } else if (errorStatus == 404 || errorStatus == 500) {
          setErrorMessage(error.response.data.message);
          setErrorVisible(true);
        } else {
          console.error('Error in backend', error);
        }
      });
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  function logout() {
    AsyncStorage.removeItem('token');
    navigator.navigate('Login');
    console.log('token cleared');
  }

  async function updateUsername() {
    setNewUsername(username);
    setDialogVisible(true);
  }

  async function deleteAccount() {
    try {
      if (!password) return;
      setDeleteDialogVisible(false);
      const token = await AsyncStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const url = `http://10.0.2.2:3000/${userId}/deleteAccount`;
      await axios.delete(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
        },
        data: {
          password,
        },
      });
      logout();
    } catch (error) {
      Alert.alert('Error deleting account', error.response.data.message);
    } finally {
      setPassword('');
    }
  }

  return (
    <View style={styles.container}>
      {errorVisible && <Text>{errorMessage}</Text>}
      <View style={styles.row}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>
      </View>

      <TouchableOpacity style={styles.row} onPress={updateUsername}>
        <Text style={styles.label}>Username</Text>
        <View style={styles.value}>
          <Text>{username}</Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => navigator.navigate('Change Password')}>
        <Text style={styles.label}>Change password</Text>
        <View style={styles.value}>
          <Entypo name="chevron-right" size={24} color="black" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.row, { marginTop: 20 }]}
        onPress={() => setDeleteDialogVisible(true)}
      >
        <Text style={styles.logout}>Delete account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={logout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>

      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Update Username</Dialog.Title>
        <Dialog.Description>Enter your new username:</Dialog.Description>
        <Dialog.Input onChangeText={(text) => setNewUsername(text)} value={newUsername} />
        <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
        <Dialog.Button
          label="Update"
          onPress={async () => {
            try {
              setDialogVisible(false);
              if (newUsername) {
                const token = await AsyncStorage.getItem('token');
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;
                const url = `http://10.0.2.2:3000/${userId}/updateUsername`;

                await axios.put(
                  url,
                  { newUsername },
                  {
                    headers: {
                      Authorization: token ? `Bearer ${token}` : null,
                    },
                  },
                );
                getUserDetails();
              }
            } catch (error) {
              Alert.alert('Error updating username', error.response.data.message);
            }
          }}
        />
      </Dialog.Container>

      <Dialog.Container visible={deleteDialogVisible}>
        <Dialog.Title>Delete Account</Dialog.Title>
        <Dialog.Description>Are you sure you want to delete your account?</Dialog.Description>
        <Dialog.Input
          placeholder="Enter your password"
          onChangeText={(text) => setPassword(text)}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setDeleteDialogVisible(false);
            setPassword('');
          }}
        />
        <Dialog.Button label="Delete" onPress={deleteAccount} />
      </Dialog.Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    paddingTop: 10,
  },
  settingsButton: {
    borderBottomWidth: 1,
    padding: 10,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomColor: '#e9e9e9',
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logout: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
});
