import "react-native-gesture-handler";
import React from 'react';
import { View, StyleSheet, Settings,Image,Text } from "react-native";
import {FontAwesome5,FontAwesome6,Ionicons,MaterialIcons} from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import {DrawerItemList , createDrawerNavigator } from "@react-navigation/drawer";
import CameraScreen from "./CameraScreen";
import FriendsScreen from "./FriendsScreen";
import GroupsScreen from "./GroupsScreen";
import ReceiptScreen from "./ReceiptScreen";
import SettingsScreen from "./SettingsScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import user from "../assets/user.png"
const Drawer = createDrawerNavigator();


function SideMenuScreen() {
    return (
         <NavigationContainer>
            <Drawer.Navigator 
            
            drawerContent={
                (props) => {
                    return(
                        <SafeAreaView>
                            <View style={userAvatarBackGroundStyle}>
                                <Image source={user} style={userAvatarStyle}/>
                                <Text>Adam Mickiewicz</Text>
                            </View>
                            <DrawerItemList {...props}/>
                        </SafeAreaView>
                    )
                }
            }

            screenOptions={globalNavBarStyle}>
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

const globalNavBarStyle = StyleSheet.create({
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

const userAvatarBackGroundStyle = StyleSheet.create({
    height:200,
    width: '100%',
    justifyContent:"center",
    alignItems:"center",
    borderBottomColor:"#f4f4f4",
    borderBottomWidth: 1,
    backgroundColor: "gray"
    }
);

const userAvatarStyle = StyleSheet.create({
    height:130,
    width:130,
    borderRadius:65
}
);
