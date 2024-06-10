import { View, Text, Button } from "react-native";
import React from 'react';
import { auth } from '../backend/config'; // імпортувати firebase або auth з вашого конфігураційного файлу


function SettingsScreen({ navigation }) {

    // function logOut() {
    //     auth.currentUser. .signOut()
    //         .then(() => {
    //             // Успішно вийшли з облікового запису
    //             navigation.navigate('WelcomeScreen'); // Перенаправлення на WelcomeScreen
    //         })
    //         .catch((error) => {
    //             // Виникла помилка при виході з облікового запису
    //             console.error('Помилка виходу з облікового запису:', error);
    //         });
    // }

    return (
        <View>
            <Button title="Log Out"/>
        </View>
    );
}

export default SettingsScreen;
