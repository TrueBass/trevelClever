import "react-native-gesture-handler";
import React from 'react';
import { View, StyleSheet, Settings } from "react-native";
import {
    FontAwesome5,
    FontAwesome6,
    Ionicons,
    MaterialIcons
} from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from "@react-navigation/drawer";
import CameraScreen from "./CameraScreen";
import FriendsScreen from "./FriendsScreen";
import GroupsScreen from "./GroupsScreen";
import ReceiptScreen from "./ReceiptScreen";
import SettingsScreen from "./SettingsScreen";

const Drawer = createDrawerNavigator();

function SideMenuScreen() {
    return (
         <NavigationContainer>
            <Drawer.Navigator screenOptions={styles}>
                <Drawer.Screen
                    name="Camera"
                    options={
                        {
                            drawerLabel:"Camera",
                            title:"Camera",
                            drawerIcon:() => (
                                <FontAwesome5 name="camera-retro" size={24} color="black" />)
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
                                <FontAwesome5 
                                name="user-friends" 
                                size={24} 
                                color="black" />)
                        }
                    }
                    component={FriendsScreen}
                />
                <Drawer.Screen
                name = "Groups"
                options={
                    {
                        drawerLabel:"Groups",
                        title:"Groups",
                        drawerIcon:() => (
                        <FontAwesome6 
                        name="people-group" 
                        size={24} 
                        color="black"/>)
                    }
                }
                component={GroupsScreen}
            />
            <Drawer.Screen
            name = "Receipt"
            options={
                {
                    drawerLabel:"Receipt",
                    title:"Receipt",
                    drawerIcon:() => (
                        <Ionicons 
                        name="receipt-sharp" 
                        size={24} 
                        color="black" />)
                }
            }
            component={ReceiptScreen}
            />
            <Drawer.Screen
            name = "Settings"
            options={
                {
                    drawerLabel:"Settings",
                    title:"Settings",
                    drawerIcon:() =>(
                        <MaterialIcons 
                        name="settings-suggest" 
                        size={24} 
                        color="black" />)
                }
            }
            component={SettingsScreen}
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