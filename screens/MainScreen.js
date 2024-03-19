import Title from "../components/Title";
import PrimaryButton from "../components/PrimaryButton";

import { useState } from "react";
import {View, Text, StyleSheet} from "react-native";

function MainScreen({onUserOption}){

    function signUpHandler(){
        onUserOption(false);
    }

    function signInHandler(){
        onUserOption(true);
    }

    return (
        <View style={styles.main}>
            <View style={styles.titleComponent}>
                <Title>Welcome</Title>
            </View>
            <View style={styles.buttonsComponent}>
                <PrimaryButton onPress={signUpHandler}>
                    Sign Up
                </PrimaryButton>
                <PrimaryButton onPress={signInHandler}>
                    Sign In
                </PrimaryButton>
            </View>
        </View>
    );
}

export default MainScreen;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignContent: 'center',
    },
    titleComponent: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsComponent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});
