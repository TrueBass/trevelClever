import { StyleSheet, View, Text } from "react-native";

function GroupItem(props){
    return(
        <View style={styles.groupItem}>
            <Text style={styles.groupName} >{props.nameGroup}</Text>
        </View>
    )
};

export default GroupItem;

const styles = StyleSheet.create({
groupItem:{
    margin: 8,
    padding: 16,
    borderRadius: 6,
    backgroundColor: '#5e0acc'
},
groupName:{
    color:'white',
    fontSize : 10
}
});