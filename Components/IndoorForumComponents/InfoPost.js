import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function InfoPost({ postDetails }) {
    const postCreatedAt = new Date(postDetails.createTime).toLocaleDateString();
    const postIsModified = postDetails.modifyTime != null;
    const postLastModifiedAt = postIsModified ? new Date(postDetails.modifyTime).toLocaleDateString() : null;

    return (
        <View style={styles.container}>
            <View style={styles.postDetails.container}>
                <Text style={styles.postDetails.titleText}>{postDetails.title}</Text>
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
            paddingBottom: 0
        },
        titleText: {
            fontWeight: 'bold',
            fontSize: 19,
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
    }
})