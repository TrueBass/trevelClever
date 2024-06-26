import {StyleSheet, View, Text, TextInput} from 'react-native';

function InputField({minLength = undefined, keyboardType=null, emptyString=false, returnKeyType='default', onSearch=null, fieldName, value, onChangeText, placeholder, secureTextEntry}){
    return (
        <View>
            {
                fieldName &&
                <Text style={{marginBottom: 5, color: emptyString?'red':'#462375'}}>
                    {fieldName}
                </Text>
            }
            <TextInput
                style={[styles.textInputComponent,{borderColor: emptyString?'red':'#FFF8E3', minWidth: minLength}]}
                placeholderTextColor={'#b6b6b68b'}
                autoCapitalize='none'
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry || false}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSearch}
                keyboardType={keyboardType}
            />
        </View>
    );
}

export default InputField;

const styles = StyleSheet.create({
    textInputComponent: {
        padding: 8,
        fontSize: 20,
        fontWeight: '400',
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: '#FFF8E3',
        overflow: 'hidden',
    },
});