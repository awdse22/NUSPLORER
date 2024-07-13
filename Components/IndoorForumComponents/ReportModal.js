import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons';

const reportReasons = [
    { 
        label: 'Content is inappropriate, offensive or irrelevant', 
        value: 'Inappropriate/Offensive/Irrelevant'
    },
    { 
        label: 'Inaccurate/Outdated content', 
        value: 'Inaccurate/Outdated'
    }
]

function dummyRefresh() {
    console.log('Should be refreshing page');
}

export default function ReportModal({ 
    modalVisible, closeModal, contentId, contentType, refreshPage = dummyRefresh }) {
    const [reason, setReason] = useState(null);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    async function report() {
        const token = await AsyncStorage.getItem('token');
        const url = `http://10.0.2.2:3000/report/${contentId}`;
        if (reason) {
            try {
                const response = await axios.post(url, {
                    contentType: contentType,
                    reason: reason
                }, { 
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : null
                    }
                })
                
                if (response.data.deletedContent) {
                    Alert.alert('Report successful', `Due to a large amount of reports, the ${contentType} has been removed`);
                    refreshPage();
                } else {
                    Alert.alert('Report successful', `Your report for this ${contentType} has been made successfully`);
                }
                close();
            } catch (error) {
                const errorStatus = error.response.status;
                const errorMessage = error.response.data.error;
                if (errorStatus == 400) {
                    Alert.alert(errorMessage);
                } else if (errorStatus == 404) {
                    Alert.alert(`The ${contentType} is not found or may have been deleted`);
                } else if (errorStatus == 500) {
                    Alert.alert("An error occurred while making a report");
                    console.log(`Error making report: `, errorMessage);
                } else {
                    console.error(error);
                }
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
                    <View style={styles.subContainer}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={report}>
                            <Text style={styles.buttonText}>Report</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonContainer} onPress={close}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(0,0,0,0.85)",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    window: {
        backgroundColor: "white",
        borderRadius: 10,
        width: "80%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    subContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 22,
        flexDirection: 'row'
    },
    titleText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28
    },
    buttonContainer: {
        width: 90,
        margin: 10,
        padding: 10,
        backgroundColor: '#2164cf',
        borderWidth: 0.5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
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
            width: '90%'
        },
        itemContainer: {
            borderWidth: 0.5,
            borderColor: 'grey',
            padding: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        itemText: {
            flex: 1,
            fontSize: 16
        }
    }
})