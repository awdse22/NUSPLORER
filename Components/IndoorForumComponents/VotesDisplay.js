import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Entypo } from '@expo/vector-icons';

async function logVoteChange(initial, updated) {
    console.log(`Initial vote: ${initial}, Updated vote: ${updated}`);
    return true;
}

export default function VotesDisplay({ voteValue = 0, numberOfVotes = 0, 
    onVoteChange = logVoteChange, textColor = 'black', alignment = 'horizontal' }) {
    const [vote, setVote] = useState(voteValue);
    const [voteCount, setVoteCount] = useState(numberOfVotes);
    const [updatingVote, setUpdatingVote] = useState(false);

    function handleDownvote() {
        if (vote == -1) {
            updateVote(-1, 0);
        } else {
            updateVote(vote, -1);
        }
    }

    function handleUpvote() {
        if (vote == 1) {
            updateVote(1, 0);
        } else {
            updateVote(vote, 1);
        }
    }

    async function updateVote(initial, updated) {
        setUpdatingVote(true);
        const updateSuccessful = await onVoteChange(initial, updated);
        if (updateSuccessful) {
            setVote(updated);
            setVoteCount(prevVoteCount => prevVoteCount + updated - initial);
        }
        setUpdatingVote(false);
    }

    return (
        <View style={{ flexDirection: alignment == 'horizontal' ? 'row' : 'column' }}>
            <TouchableOpacity onPress={handleUpvote}>
                <Entypo name="arrow-bold-up" size={24} color={vote == 1 ? 'lightgreen' : '#cfcfcf'} />
            </TouchableOpacity>
            {updatingVote ? (
                <ActivityIndicator 
                    animating={true}
                    size='small'
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }]}}
                    color='#00ace6'
                />
            ) : (
                <Text style={[styles.voteCount, { color: textColor }]}> 
                 {voteCount} 
                </Text>
            )}
            <TouchableOpacity onPress={handleDownvote}>
                <Entypo name="arrow-down" size={24} color={vote == -1 ? 'red' : '#cfcfcf'} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    voteCount: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center'
    }
})