import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function PageSelector({ totalPages, pageNumber, onPageChange }) {
    const isFirstPage = pageNumber == 1;
    const isLastPage = pageNumber == totalPages;

    const PageButton = ({number}) => {
        return (
            <View>
                {number == pageNumber ? (
                    <View style={styles.selectPageButton}>
                        <Text style={styles.selectPageButtonText}>{number}</Text>
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => onPageChange(number)}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>{number}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        )
    }

    const PageNumbers = () => {
        const startPage = Math.max(pageNumber - 1, 1);
        const endPage = Math.min(pageNumber + 1, totalPages);
        const pages = [];
        for (let i = startPage; i <= endPage; i++ ) {
            pages.push(i);
        }
        return (
            <View style={{ flexDirection: 'row' }}>
                {pages.map((page) => <PageButton key={page} number={page} />)}
            </View>
        )
    }

    const PageNavigator = ({ children }) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {!isFirstPage && (
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => onPageChange(1)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>{"<<"}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onPageChange(pageNumber - 1)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>{"<"}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                {children}
                {!isLastPage && (
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => onPageChange(pageNumber + 1)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>{">"}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onPageChange(totalPages)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>{">>"}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        )
    }

    return (
        <View>
            {totalPages > 0 && (
                <View style={styles.container}>
                    <PageNavigator>
                        <PageNumbers />
                    </PageNavigator>                    
                </View>
            )}
        </View>   
    )
}

const styles=StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 8,
        paddingTop: 0,
    },
    button: {
        width: 35,
        height: 35,
        padding: 5,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#2164cf',
        margin: 2,
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white'
    },
    selectPageButton: {
        width: 35,
        height: 35,
        padding: 5,
        borderWidth: 2,
        borderRadius: 8,
        backgroundColor: 'white',
        margin: 2,
    },
    selectPageButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    }
})