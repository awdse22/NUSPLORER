import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';

async function logVoteChange(initial, updated) {
    console.log(`Initial vote: ${initial}, Updated vote: ${updated}`);
    return null;
}

export default function VotesDisplay({ voteValue = 0, numberOfVotes = 0, onVoteChange = logVoteChange }) {
    const [vote, setVote] = useState(voteValue);
    const [voteCount, setVoteCount] = useState(numberOfVotes);

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
        const updateSuccessful = await onVoteChange(initial, updated);
        if (updateSuccessful) {
            setVote(updated);
            setVoteCount(prevVoteCount => prevVoteCount + updated - initial);
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleUpvote}>
                <Entypo name="arrow-bold-up" size={24} color={vote == 1 ? 'green' : '#cfcfcf'} />
            </TouchableOpacity>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}> {voteCount} </Text>
            <TouchableOpacity onPress={handleDownvote}>
                <Entypo name="arrow-down" size={24} color={vote == -1 ? 'red' : '#cfcfcf'} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    }
})