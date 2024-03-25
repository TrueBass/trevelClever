import "react-native-gesture-handler";
import React from 'react';
import { View, StyleSheet } from "react-native";
import {
    SimpleLineIcons,
    MaterialIcons,
    MaterialCommunityIcons,
    FontAwesome
} from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from "@react-navigation/drawer";
import CameraScreen from "./CameraScreen";
import FriendsScreen from "./FriendsScreen";

const Drawer = createDrawerNavigator();

function SideMenuScreen() {
    return (
         <NavigationContainer>
            <Drawer.Navigator screenOptions={styles}>
                <Drawer.Screen
                    name="CameraScreen"
                    options={
                        {
                            drawerLabel:"CameraScreen",
                            title:"CameraScreen",
                            drawerIcon:() => (
                                <SimpleLineIcons
                                    name="home"
                                    size={20}
                                    color="#808080"
                                />)
                        }
                    }
                    component={CameraScreen}
                />
                <Drawer.Screen
                    name="Friends"
                    options={
                        {
                            drawerLabel:"Friends",
                            title:"Friends",
                            drawerIcon:() => (
                                <SimpleLineIcons
                                    name="tag"
                                    size={20}
                                    color="#808080"
                                />)
                        }
                    }
                    component={FriendsScreen}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default SideMenuScreen;

const styles = StyleSheet.create({
    drawerStyle:{
        backgroundColor : "#fff",
        width :250
    },
    headerStyle:{
        backgroundColor: "f4511e"
    },
    headerTintColor: "#fff",
    headerTittleStyle:{
        fontWeight:"bold"
    },
    drawerActiveTintColor:"blue",
    drawerLabelStyle:{
        color:"#111"
    }
});