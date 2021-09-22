import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        title: 'Call for Guitar',
        desc: 'See if they can fix it',
        createdOn: '9/21/21',
        due: '9/21/21'
    }
]

export default function Soon() {
    const [data, setData] = useState({})

    useEffect(() => {
        getData()
    }, [data])

    const renderItem = ({ item }) => {
        return (
            <View>
                <Text>{item.title}</Text>
                <Text>{item.desc}</Text>
                <Text>{item.due}</Text>
            </View>
        )
    }

    const addData = async () => {
        let tempJson = JSON.stringify(fakeData)
        try {
            await AsyncStorage.setItem('testingData', tempJson)
        } catch (error) {
            console.log(error)
        }
    }

    const getData = async () => {
        try {
            let jsonValue = await AsyncStorage.getItem('testingData')
            // console.log(jsonValue)
            if (jsonValue !== null) {
                setData(JSON.parse(jsonValue))
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            <Text>Soon Component</Text>
            <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id} />
            <Button title="Add Data" onPress={addData}></Button>
            <Button title="Get Data" onPress={getData}></Button>
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
