import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const fakeData = [
    {
        id: 1,
        title: 'Oil Change',
        desc: 'Call 23400683010',
        createdOn: '9/21/21',
        due: '9/21/21'
    },
    {
        id: 2,
        title: 'Call for guitar',
        desc: 'See if they can',
        createdOn: '9/21/21',
        due: '9/21/21'
    }
]

export default function Soon() {

    const renderItem = ({ item }) => {
        return (
            <View>
                <Text>{item.title}</Text>
                <Text>{item.desc}</Text>
                <Text>{item.due}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text>Soon Component</Text>
            <FlatList data={fakeData} renderItem={renderItem} keyExtractor={(item) => item.id} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
