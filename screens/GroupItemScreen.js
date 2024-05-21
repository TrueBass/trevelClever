import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function GroupItemScreen({ groupId, onBack }) {
    return (
        <View style={styles.container}>
            <Text>Edit Group Screen</Text>
            <Text>Group ID: {groupId}</Text>
            <Button title="Back to Groups" onPress={onBack} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default GroupItemScreen;
