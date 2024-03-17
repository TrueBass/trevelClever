import {StyleSheet, View, Text, TextInput} from 'react-native';

function InputField({fieldName, value, onChangeText, placeholder}){
    return (
        <View>
            <Text style={styles.fieldNameComponent}>{fieldName}</Text>
            <TextInput
                style={styles.textInputComponent}
                autoCapitalize='none'
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
}

export default InputField;

const styles = StyleSheet.create({
    fieldNameComponent: {
        color: '#b6b6b6',
        fontFamily: 'Helvetica'
    },
    textInputComponent: {
        padding: 8,
        fontSize: 20,
        fontFamily: 'Helvetica',
        fontWeight: '400',
        borderRadius: 16,
        borderColor: '#FFF8E3',
        backgroundColor: '#FFF8E3',
        overflow: 'hidden'
    },
});