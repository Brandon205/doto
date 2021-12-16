import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, Modal, TextInput, Pressable, FlatList } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function TaskRenderer() { // Renders buttons to change the type of task that is shown/being edited
    const [taskType, setTaskType] = useState('soon');
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentData, setCurrentData] = useState([]);
    const [soonData, setSoonData] = useState([]);
    const [laterData, setLaterData] = useState([]);
    const [eventuallyData, setEventuallyData] = useState([]);
    const [title, onChangeTitle] = useState("");
    const [desc, onChangeDesc] = useState("");
    const [editTitle, onChangeEditTitle] = useState("");
    const [editDesc, onChangeEditDesc] = useState("");
    const [editId, setEditId] = useState("");

    useEffect(() => {
        getAllData()
        if (taskType === 'soon') {
            setCurrentData(soonData)
        } else if (taskType === 'later') {
            setCurrentData(laterData)
        } else if (taskType === 'eventually') {
            setCurrentData(eventuallyData)
        }
    }, [soonData, laterData, eventuallyData, taskType])

    const renderItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescs}>{item.desc}</Text>
                <Text style={styles.cardDate }>{item.createdOn}</Text>
                <View style={styles.editButtons}>
                    <Icon name="edit" style={styles.icon} size={25} color="#6C48EF" onPress={() => { setEditModalVisible(true); onChangeEditTitle(item.title); onChangeEditDesc(item.desc); setEditId(item.id); } } />
                    <Icon name="delete" style={styles.icon} size={25} color="#6C48EF" onPress={() => removeItem(item.id)} />
                </View>
            </View>
        )
    }

    const addItem= async () => {
        let tempJson;
        if (taskType === 'soon') {
            let dataCopy = soonData.push({id: uuid(), title: title, desc: desc, createdOn: new Date().toDateString(), complete: false})
            tempJson = JSON.stringify(dataCopy)
        } else if (taskType === 'later') {
            let dataCopy = laterData.push({id: uuid(), title: title, desc: desc, createdOn: new Date().toDateString(), complete: false})
            tempJson = JSON.stringify(dataCopy)
        } else if (taskType === 'eventually') {
            let dataCopy = eventuallyData.push({id: uuid(), title: title, desc: desc, createdOn: new Date().toDateString(), complete: false})
            tempJson = JSON.stringify(dataCopy)
        }
        try {
            await AsyncStorage.setItem(taskType, tempJson)
        } catch (error) {
            console.log(error)
        }
    }

    let editItem = async (id) => {
        // use removeItem, and then just add the item again with the same id and new details



    }

    let removeItem = async (id) => {
        // copy the current list of items based on the taskType, then remove the one at the index that has a matching id,
        // then update the stored list with the copied and modified one

        let tempList = [...currentData]
        tempList = Object.entries(tempList)

        for (let i = 0; i < tempList.length; i++) {
            if (tempList[i][1].id === id) {
                console.log('Getting rid of ' + tempList[i][1].title)
                tempList.splice(i, 1)
            }
        }
        tempList = Object.fromEntries(tempList)
        setCurrentData(tempList)
        tempList = JSON.stringify(tempList)

        console.log(typeof(tempList))

        try {
            await AsyncStorage.removeItem('@' + taskType)
        } catch(error) {
            console.log(error)
        }

        try {
            await AsyncStorage.setItem(taskType, tempList)
        } catch (error) {
            console.log(error)
        }

        getAllData()
        
        //TODO: REMOVE THE BELOW TEMPORARY CODE
        // console.log('done')
        // getAllData()
    }

    const getAllData = async () => {
        try {
            let soonValue = await AsyncStorage.getItem('@soon')
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
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.inline}>
                <Button title="Soon" onPress={() => setTaskType("soon")} color={taskType === "soon" ? 'green' : 'blue'} />
                <Button title="Later" onPress={() => setTaskType("later")} color={taskType === "later" ? 'green' : 'blue'} />
                <Button title="Eventually" onPress={() => setTaskType("eventually")} color={taskType === "eventually" ? 'green' : 'blue'} />
            </View>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)} >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Add a new {taskType} task here</Text>
                        <TextInput value={title} onChangeText={onChangeTitle} placeholder="Task name" style={styles.input} />
                        <TextInput value={desc} onChangeText={onChangeDesc} placeholder="Task description" style={styles.input} />
                        <Button title="Add Item" onPress={() => {addItem(); setModalVisible(!modalVisible)}} />
                        <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal animationType="slide" transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(!editModalVisible)} >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Edit the task here</Text>
                        <TextInput value={editTitle} onChangeText={onChangeEditTitle} placeholder="Task name" style={styles.input} />
                        <TextInput value={editDesc} onChangeText={onChangeEditDesc} placeholder="Task description" style={styles.input} />
                        <Button title="Save Item" onPress={() => {editItem(); setEditModalVisible(!editModalVisible)}} />
                        <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setEditModalVisible(!editModalVisible)}>
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Text>Current {taskType} Tasks:</Text>
            <FlatList data={currentData} renderItem={renderItem} keyExtractor={(item) => item.id} />
            <Button title="Add new task" onPress={() => setModalVisible(!modalVisible)} />
            <Button title="TEMP RESET" onPress={() => removeItem()} />
        </View>
    )
}

const styles = StyleSheet.create({ // #646EE for delete/edit buttons on cards
    container: {
        display: 'flex',
        backgroundColor: 'whitesmoke',
        width: Dimensions.get("window").width,
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
    card: {
        backgroundColor: 'white',
        flex: 1,
        padding: 20,
        boxShadow: '1px 1px 6px gray;',
        borderRadius: 15,
        marginVertical: 8,
        marginHorizontal: 8,
        minWidth: 200

    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    cardDesc: {
        fontSize: '1.1em'
    },  
    cardDate: {
        color: 'gray',
        fontWeight: '350',
        fontDecoration: 'italicized',
        fontSize: '0.8em',
        marginTop: 5,
        marginBottom: 15,
    },
    icon: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        color: '#6C48EF'
    },
    editButtons: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    }
})
