import React, { useState } from 'react'
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native'

export default function TaskRenderer() { // Renders buttons to change the type of task that is shown/being edited
    const [taskType, setTaskType] = useState('Soon')

    return (
        <View style={styles.container}>
            <View style={styles.inline}>
                <Button title="Soon" onPress={() => setTaskType("Soon")} color={taskType === "Soon" ? 'green' : 'blue'} />
                <Button title="Later" onPress={() => setTaskType("Later")} color={taskType === "Later" ? 'green' : 'blue'} />
                <Button title="Eventually" onPress={() => setTaskType("Eventually")} color={taskType === "Eventually" ? 'green' : 'blue'} />
            </View>
            <Text>TaskRenderer</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: 'whitesmoke',
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        alignItems: 'center',
        width: '1000'
    },
    inline: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'space-between'
    }
})
