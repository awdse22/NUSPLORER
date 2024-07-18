import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VotesDisplay from './VotesDisplay';
import OptionsModal from './OptionsModal';
import ReportModal from './ReportModal';

export default function InfoPost({ postDetails, voteUpdater, refreshPage }) {
    const [optionsModalOpen, setOptionsModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);

    const postCreatedAt = new Date(postDetails.createTime).toLocaleDateString();
    const postIsModified = postDetails.modifyTime != null;
    const postLastModifiedAt = postIsModified ? new Date(postDetails.modifyTime).toLocaleDateString() : null;

    async function updateVote(initial, updated) {
        const updateSuccessful = await voteUpdater(postDetails._id, initial, updated);
        return updateSuccessful;
    }

    function makeReport() {
        setOptionsModalOpen(false);
        setReportModalOpen(true);
    }

    return (
        <View style={styles.container}>
            <View style={styles.postDetails.container}>
                <View style={styles.postDetails.titleContainer}>
                    <Text style={styles.postDetails.titleText}>{postDetails.title}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <VotesDisplay 
                            voteValue={postDetails.userVote} 
                            numberOfVotes={postDetails.voteCount} 
                            onVoteChange={updateVote}
                        />
                        <TouchableOpacity onPress={() => setOptionsModalOpen(true)}>
                            <Ionicons name="ellipsis-vertical" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.postDetails.usernameText}>
                        by {postDetails.creator.username}
                    </Text>
                    <Text style={styles.postDetails.dateText}>
                        {postIsModified ? `Last modified at ${postLastModifiedAt}`
                            : `Created at ${postCreatedAt}`
                        }
                    </Text>
                </View>
            </View>
            <Text style={styles.postContent}>{postDetails.content}</Text>
            <OptionsModal 
                modalVisible={optionsModalOpen}
                closeModal={() => setOptionsModalOpen(false)}
                makeReport={makeReport}
            />
            <ReportModal 
                modalVisible={reportModalOpen} 
                closeModal={() => setReportModalOpen(false)}
                contentId={postDetails._id}
                contentType='post'
                refreshPage={refreshPage}
            />
        </View>
    )
}

const styles=StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderRadius: 12,
        borderColor: 'grey',
        flexDirection: 'column',
        padding: 5,
    },
    postDetails: {
        container: {
            flexDirection: 'column',
            paddingLeft: 10,
            paddingTop: 8,
            paddingBottom: 0,
        },
        titleContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 12,
        },
        titleText: {
            fontWeight: 'bold',
            fontSize: 19,
            flex: 1,
            paddingRight: 8,
        },
        usernameText: {
            fontSize: 16
        },
        dateText: {
            fontSize: 13,
            color: 'grey',
            marginLeft: 8,
        }
    },
    postContent: {
        fontSize: 15,
        padding: 10
    },
})