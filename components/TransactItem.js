import {View, Text, Pressable, StyleSheet} from 'react-native';

export default function TransactItem({onPress, leftNick, rightNick, value}) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.transactView}>
        <Text style={{fontSize: 20}}>{leftNick+" -> "}</Text>
        <Text style={{fontSize: 20}}>{rightNick} : </Text>
        <Text style={{fontSize: 20}}>{value}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  transactView: {
    flex: 1,
    justifyContent:'center',
    alignContent: "space-between",
    borderRadius: 20,
    borderWidth: 3,
    height: 50,
  },
});