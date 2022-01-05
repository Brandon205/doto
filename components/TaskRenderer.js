import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Modal, TextInput, FlatList, Pressable } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GestureRecognizer from 'react-native-swipe-gestures';

export default function TaskRenderer() { // Renders the whole app and handles most of the app as well
    const [taskType, setTaskType] = useState('');
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

    useEffect(() => { // This will get all of the data at the start when the app is opened and whenever a user switches screens
        getAllData()
        if (taskType === '') { // Updates data on initial render after content has been fetched
            setTaskType('soon')
        }
        if (taskType === 'soon') {
            setCurrentData(soonData)
        } else if (taskType === 'later') {
            setCurrentData(laterData)
        } else if (taskType === 'eventually') {
            setCurrentData(eventuallyData)
        }
    }, [taskType, currentData])

    const renderItem = ({ item }) => { // For the FlatList component that renders each of the tasks based on what is in state (currentData)
        let completeOrNot;
        if (item.complete) {
            completeOrNot = (<Icon name="close" style={styles.icon} size={35} color="#6800F4" onPress={() => completeTask(item.id, item.title, item.desc, item.createdOn, item.complete)} />)
        } else {
            completeOrNot = (<Icon name="check" style={styles.icon} size={35} color="#6800F4" onPress={() => completeTask(item.id, item.title, item.desc, item.createdOn, item.complete)} />)
        }

        return (
            <View style={[{backgroundColor: item.complete ? '#00ff129e' : 'white'}, styles.card]}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescs}>{item.desc}</Text>
                <Text style={styles.cardDate }>{item.createdOn}</Text>
                <View style={styles.editButtons}>
                    <Icon name="file-edit" style={styles.icon} size={35} color="#6800F4" onPress={() => { setEditModalVisible(true); onChangeEditTitle(item.title); onChangeEditDesc(item.desc); setEditId(item.id) } } />
                    <Icon name="delete" style={styles.icon} size={35} color="#6800F4" onPress={() => deleteTask(item.id)} />
                    {completeOrNot}
                </View>
            </View>
        )
    }

    const addItem = async () => { // Uses the data from the inputs that is stored in state to create a new task for the current taskType, and pushes that to Async storage
        let tempJson = [];
        let dataCopy;
        if (taskType === 'soon') {
            dataCopy = soonData
            dataCopy.push({id: uuid(), title: title, desc: desc, createdOn: new Date().toDateString(), complete: false})
            tempJson = JSON.stringify(dataCopy)
        } else if (taskType === 'later') {
            dataCopy = laterData
            dataCopy.push({id: uuid(), title: title, desc: desc, createdOn: new Date().toDateString(), complete: false})
            tempJson = JSON.stringify(dataCopy)
        } else if (taskType === 'eventually') {
            dataCopy = eventuallyData
            dataCopy.push({id: uuid(), title: title, desc: desc, createdOn: new Date().toDateString(), complete: false})
            tempJson = JSON.stringify(dataCopy)
        }

        setCurrentData(dataCopy)
        onChangeTitle("");
        onChangeDesc("");

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
                dataCopy.splice(i, 1)
                removedIndex = i
            }
        }

        return [dataCopy, removedIndex];
    }

    let editItem = async (itemId) => { // Use removeItem function, and then just add the item again with the same id and new details
        let [tempList, index] = removeItem(itemId)

        tempList.splice(index, 0, {id: itemId, title: editTitle, desc: editDesc, createdOn: new Date().toDateString(), complete: false})

        // Setting the current data will update the state so that the items refresh
        setCurrentData(tempList)
        
        // Clear editTitle and editDesc here
        onChangeEditDesc("");
        onChangeEditTitle("");

        // Update the rest of the app with the new list of data
        switch (taskType) { // Used to update the data that the useEffect hook will be setting to the currentData when the screens are changed
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
        }

        tempList = JSON.stringify(tempList)

        try { // Update Async Storage
            await AsyncStorage.setItem(taskType, tempList)
        } catch (error) {
            console.log(error)
        }
    }

    let deleteTask = async (itemId) => { // Uses removeItem to get rid of the now deleted task, then updates the rest of the app with updated data (currentData, soon/later/eventuallyData, and AsyncStorage)
        let [tempList] = removeItem(itemId)
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
        }

        tempList = JSON.stringify(tempList)

        try { // Update Async Storage
            await AsyncStorage.setItem(taskType, tempList)
        } catch (error) {
            console.log(error)
        }
    }

    let completeTask = async (itemId, itemTitle, itemDesc, createdDate, currentlyComplete) => { // Completes a task by using removeItem(), then adding that same item to the end of the list with completed: true     
        let [tempList] = removeItem(itemId)

        tempList.push({id: itemId, title: itemTitle, desc: itemDesc, createdOn: createdDate, complete: !currentlyComplete})

        // Setting the current data will update the state so that the items refresh
        setCurrentData(tempList)

        // Update the rest of the app with the rearranged list of data
        switch (taskType) { // Used to update the data that the useEffect hook will be setting to the currentData when the screens are changed
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
            let soonValue = await AsyncStorage.getItem('soon')
            if (soonValue !== null) {
                setSoonData(JSON.parse(soonValue))
            } else { // There is no currently stored soon data
                setSoonData([])
            }
            let laterValue = await AsyncStorage.getItem('later')
            if (laterValue !== null) {
                setLaterData(JSON.parse(laterValue))
            } else { // There is no currently stored later data
                setLaterData([])
            }
            let eventuallyValue = await AsyncStorage.getItem('eventually')
            if (eventuallyValue !== null) {
                setEventuallyData(JSON.parse(eventuallyValue))
            } else { // There is no currently stored eventually data
                setEventuallyData([])
            }
        } catch (error) {
            console.log(error)
        }
    }

    let scrollLeft = () => { // User wants page to go to the right ("soon" > "later")
        if (taskType === 'soon') {
            setTaskType('later');
            setCurrentData(laterData);
        } else if (taskType === 'later') {
            setTaskType('eventually');
            setCurrentData(eventuallyData);
        }
    }
    let scrollRight = () => { // User wants page to go to the left ("later" > "soon")
        if (taskType === 'later') {
            setTaskType('soon');
            setCurrentData(soonData);
        } else if (taskType === 'eventually') {
            setTaskType('later');
            setCurrentData(laterData);
        }
    }

    return (
        <GestureRecognizer style={styles.container} onSwipeRight={(gestureState) => scrollRight()} onSwipeLeft={(gestureState) => scrollLeft()}>
            <View style={styles.topNav}>
                <Pressable onPress={() => setTaskType("soon")} style={styles.navButton}>
                    <Icon name="clock-alert" style={styles.icon} size={25} color={taskType === "soon" ? '#F2E6FF' : '#B98BF8'} />
                    <Text style={{color: taskType === "soon" ? '#F2E6FF' : '#B98BF8', fontSize: 20}}>Soon</Text>
                </Pressable>
                <Pressable onPress={() => setTaskType("later")} style={styles.navButton}>
                    <Icon name="clock-time-four" style={styles.icon} size={25} color={taskType === "later" ? '#F2E6FF' : '#B98BF8'} />
                    <Text style={{color: taskType === "later" ? '#F2E6FF' : '#B98BF8', fontSize: 20}}>Later</Text>
                </Pressable>
                <Pressable onPress={() => setTaskType("eventually")} style={styles.navButton}>
                    <Icon name="clock-time-eight" style={styles.icon} size={25} color={taskType === "eventually" ? '#F2E6FF' : '#B98BF8'} />
                    <Text style={{color: taskType === "eventually" ? '#F2E6FF' : '#B98BF8', fontSize: 20}}>Eventually</Text>
                </Pressable>
            </View>
            <Text style={styles.tasksHeader}>{taskType.toUpperCase()} TASKS</Text>
            <Pressable style={styles.createButton} onPressIn={() => setModalVisible(!modalVisible)}>
                <Icon name="plus" style={styles.icon} size={25} color="#F2E6FF" onPress={() => deleteTask(item.id)} />
            </Pressable>
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
                        <Button title="Save Item" onPress={() => {editItem(editId); setEditModalVisible(!editModalVisible)}} />
                        <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setEditModalVisible(!editModalVisible)}>
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <FlatList data={currentData} renderItem={renderItem} keyExtractor={(item) => item.id} />
        </GestureRecognizer>
    )
}

const styles = StyleSheet.create({ // purple: #6800F4, gray: #B98BF8, selected/white: #F2E6FF
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    topNav: {
        top: 0,
        backgroundColor: '#6800F4',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navButton: {
        display: 'flex',
        alignItems: 'center',
        width: 100
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
    createButton: {
        backgroundColor: '#6800F4',
        borderRadius: '50%',
        padding: 9
    },  
    tasksHeader: {
        fontSize: 20,
        padding: 12
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
        alignItems: 'center',
        padding: 20,
        shadowColor: 'gray',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 6,
        shadowOpacity: 0.5,
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
        fontSize: 15
    },  
    cardDate: {
        color: 'gray',
        fontWeight: "300",
        fontSize: 12,
        marginTop: 5,
        marginBottom: 15,
    },
    icon: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        padding: '0 20 0 20'
    },
    editButtons: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    }
})
