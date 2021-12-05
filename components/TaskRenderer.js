import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, Modal, TextInput, Pressable, FlatList } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function TaskRenderer() { // Renders buttons to change the type of task that is shown/being edited
    const [taskType, setTaskType] = useState('Soon');
    const [modalVisible, setModalVisible] = useState(false);
    const [currentData, setCurrentData] = useState([]);
    const [soonData, setSoonData] = useState([]);
    const [laterData, setLaterData] = useState([]);
    const [eventuallyData, setEventuallyData] = useState([]);
    const [title, onChangeTitle] = useState("");
    const [desc, onChangeDesc] = useState("");

    useEffect(() => {
        getAllData()
        if (taskType === 'Soon') {
            setCurrentData(soonData)
        } else if (taskType === 'Later') {
            setCurrentData(laterData)
        } else if (taskType === 'Eventually') {
            setCurrentData(eventuallyData)
        }
    }, [soonData, laterData, eventuallyData, taskType])

    const renderItem = ({ item }) => {
        return (
            <View>
                <Text>{item.title}</Text>
                <Text>{item.desc}</Text>
                <Text>{item.createdOn}</Text>
            </View>
        )
    }

    const addItem= async () => {
        let tempJson;
        if (taskType === 'Soon') {
            let dataCopy = soonData.push({id: uuid(), title: title, desc: desc, createdOn: Date(), complete: false})
            tempJson = JSON.stringify(dataCopy)
        } else if (taskType === 'Later') {
            let dataCopy = laterData.push({id: uuid(), title: title, desc: desc, createdOn: Date(), complete: false})
            tempJson = JSON.stringify(dataCopy)
        } else if (taskType === 'Eventually') {
            let dataCopy = eventuallyData.push({id: uuid(), title: title, desc: desc, createdOn: Date(), complete: false})
            tempJson = JSON.stringify(dataCopy)
        }
        try {
            console.log(tempJson)
            await AsyncStorage.setItem(taskType, tempJson)
        } catch (error) {
            console.log(error)
        }
    }

    let removeItem = async (id) => {
        // copy the current list of items, then remove the one at the index that has a matching id to the one passed in, then update the stored list with the copied and modified one
        //TODO: REMOVE THE BELOW TEMPORARY CODE
        try {
            await AsyncStorage.removeItem('@' + taskType)
        } catch(error) {
            console.log(error)
        }
        console.log('done')
        getAllData()
    }

    const getAllData = async () => {
        try {
            let soonValue = await AsyncStorage.getItem('@soon')
            console.log(soonValue)
            if (soonValue !== null) {
                console.log(soonValue)
                setSoonData(JSON.parse(soonValue))
            }
            let laterValue = await AsyncStorage.getItem('@later')
            if (laterValue !== null) {
                setLaterData(JSON.parse(laterValue))
            }
            let eventuallyValue = await AsyncStorage.getItem('@eventually')
            if (eventuallyValue !== null) {
                setEventuallyData(JSON.parse(eventuallyValue))
            }
            console.log(typeof(soonData), soonData)
            console.log(typeof(laterData), laterData)
            console.log(typeof(eventuallyData), eventuallyData)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.inline}>
                <Button title="Soon" onPress={() => setTaskType("Soon")} color={taskType === "Soon" ? 'green' : 'blue'} />
                <Button title="Later" onPress={() => setTaskType("Later")} color={taskType === "Later" ? 'green' : 'blue'} />
                <Button title="Eventually" onPress={() => setTaskType("Eventually")} color={taskType === "Eventually" ? 'green' : 'blue'} />
            </View>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)} >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Add a new {taskType} item here</Text>
                        <TextInput value={title} onChangeText={onChangeTitle} placeholder="Task name" style={styles.input} />
                        <TextInput value={desc} onChangeText={onChangeDesc} placeholder="Task Description" style={styles.input} />
                        <Button title="Add Item" onPress={() => {addItem(); setModalVisible(!modalVisible)}} />
                        <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Text>Current {taskType} Tasks:</Text>
            <FlatList data={currentData} renderItem={renderItem} keyExtractor={(item) => item.id} />
            <Button title="Add new task" onPress={() => setModalVisible(!modalVisible)} />
            <Button title="TEMP REMOVE" onPress={() => removeItem()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: 'whitesmoke',
        width: Dimensions.get("window").width,
        // height: Dimensions.get("window").height,
        alignItems: 'center',
    },
    inline: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'space-between'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "#2196F3",
        color: 'white',
        marginTop: 10
    },
})
