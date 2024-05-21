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
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#f9c2ff',
        borderRadius: 10,
    },
    groupName: {
        fontSize: 16,
    }
});
