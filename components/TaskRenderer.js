import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Dimensions, Modal, TextInput, Pressable, FlatList } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function TaskRenderer() { // Renders the whole app and handles most of the app as well
    const [taskType, setTaskType] = useState('soon');
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentData, setCurrentData] = useState([]);
    const [soonData, setSoonData] = useState([]);
    const [laterData, setLaterData] = useState([]);
    const [eventuallyData, setEventuallyData] = useState([]);
    const [title, onChangeTitle] = useState("Testing");
    const [desc, onChangeDesc] = useState("Testing");
    const [editTitle, onChangeEditTitle] = useState("");
    const [editDesc, onChangeEditDesc] = useState("");

    useEffect(() => { // This will get all of the data at the start when the app is opened and whenever a user switches screens
        getAllData()
        if (taskType === 'soon') {
            setCurrentData(soonData)
        } else if (taskType === 'later') {
            setCurrentData(laterData)
        } else if (taskType === 'eventually') {
            setCurrentData(eventuallyData)
        }
    }, [soonData, laterData, eventuallyData, currentData, taskType])

    const renderItem = ({ item }) => { // For the FlatList component that renders each of the tasks based on what is in state (currentData)
        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescs}>{item.desc}</Text>
                <Text style={styles.cardDate }>{item.createdOn}</Text>
                <View style={styles.editButtons}>
                    <Icon name="edit" style={styles.icon} size={25} color="#6C48EF" onPress={() => { setEditModalVisible(true); onChangeEditTitle(item.title); onChangeEditDesc(item.desc); } } />
                    <Icon name="delete" style={styles.icon} size={25} color="#6C48EF" onPress={() => deleteTask(item.id)} />
                </View>
            </View>
        )
    }

    const addItem= async () => { // Uses the data from the inputs that is stored in state to create a new task for the current taskType, and pushes that to Async storage
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
        // TODO: clear the textInput's states here
        try {
            await AsyncStorage.setItem(taskType, tempJson)
        } catch (error) {
            console.log(error)
        }
    }

    let removeItem = (itemId) => { // Will use the currentData from state to remove one of the items based on the itemId that is passed in (used in editItem() and removeItem())
        let dataCopy = [...currentData]
        let removedIndex; // For editItem() keeps track of where to splice updated data back into

        for (let i = 0; i < dataCopy.length; i++) { // Loops through a copy of currentData and deletes the one that has the same itemId as the one that needs to be deleted
            if (dataCopy[i].id === itemId) {
                console.log('Getting rid of ' + dataCopy[i].title) // TODO: Remove this
                dataCopy.splice(i, 1)
                removedIndex = i
            }
        }

        return [dataCopy, removedIndex];
    }

    let editItem = async (itemId) => { // Use removeItem function(or the code from it? - TODO?), and then just add the item again with the same id and new details

        // CURRENTLY THE REMOVEITEM() DOESN'T REMOVE ITEMS, ALSO THE new info is a function when it is added for some reason
        let [tempList, index] = removeItem(itemId)
        let newTitle = onChangeEditTitle
        let newDesc = onChangeEditDesc
        console.log(currentData, tempList)
        let newData = {id: itemId, title: newTitle, desc: newDesc, createdOn: new Date().toDateString(), complete: false}
        tempList.unshift({id: itemId, title: onChangeEditTitle, desc: onChangeEditDesc, createdOn: new Date().toDateString(), complete: false})
        console.log(tempList, "AFTER EDIT DATA")
        
        //TODO clear editTitle and editDesc here

        // Update the rest of the app with the new list of data
        setCurrentData(tempList)
        switch (taskType) { // Used to update the data that the UseEffect hook will be setting to the currentData when the screens are changed
            case "soon":
                setSoonData(tempList);
                break;
            case "later":
                setLaterData(tempList);
                break;
            case "eventually":
                setEventuallyData(tempList);
                break;
            default:
                console.log('Error setting state');
                break;
        }

        tempList = JSON.stringify(tempList)

        try { // Update Async Storage
            await AsyncStorage.setItem(taskType, tempList)
        } catch (error) {
            console.log(error)
        }
    }

    let deleteTask = async (itemId) => { // Uses removeItem to get rid of the now deleted task, then updates the rest of the app with updated data (currentData, soon/later/eventuallyData, and AsyncStorage)
        let [tempList, index] = removeItem(itemId)
        console.log(tempList)
        setCurrentData(tempList)
        
        switch (taskType) { // Used to update the data that the UseEffect hook will be setting to the currentData when the screens are changed
            case "soon":
                setSoonData(tempList);
                break;
            case "later":
                setLaterData(tempList);
                break;
            case "eventually":
                setEventuallyData(tempList);
                break;
            default:
                console.log('Error setting state');
                break;
        }

        tempList = JSON.stringify(tempList)

        try { // Update Async Storage
            await AsyncStorage.setItem(taskType, tempList)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllData = async () => { // Used in the useEffect hook to make sure the data is updated and accurate
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
        </View>
    )
}

const styles = StyleSheet.create({
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
