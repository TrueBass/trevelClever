import {StyleSheet, View, Text, TextInput} from 'react-native';

function InputField({fieldName, value, onChangeText, placeholder, secureTextEntry}){
    return (
        <View>
            <Text style={styles.fieldNameComponent}>{fieldName ?? ""}</Text>
            <TextInput
                style={styles.textInputComponent}
                autoCapitalize='none'
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry || false}
            />
        </View>
    );
}

export default InputField;

const styles = StyleSheet.create({
    fieldNameComponent: {
        color: '#462375',
    },
    textInputComponent: {
        padding: 8,
        fontSize: 20,
        fontWeight: '400',
        borderRadius: 16,
        borderColor: '#FFF8E3',
        backgroundColor: '#FFF8E3',
        overflow: 'hidden'
    },
});