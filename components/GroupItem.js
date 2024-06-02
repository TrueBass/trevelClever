import { StyleSheet, View, Text, Pressable } from "react-native";

function GroupItem({ nameGroup,onPress }) {
    return (
        <Pressable onPress={onPress}>
            <View style={styles.groupItem}>
                <Text style={styles.groupName}>{nameGroup}</Text>
            </View>
        </Pressable>
    );
}

export default GroupItem;

const styles = StyleSheet.create({
    groupItem: {
        padding: 8,
        margin: 8,
        backgroundColor: '#bc86d7ff',
        borderRadius: 50,
        overflow: 'hidden',
    },
    groupName: {
        fontSize: 22,
    }
});
