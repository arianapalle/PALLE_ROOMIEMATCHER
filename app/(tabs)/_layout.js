import { Tabs } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

const getColor = (focused) => (focused ? "black" : "gray");

export default function Layout() {  
  return (
    <Tabs>
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profiles",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Feather name="eye" size={24} color={getColor(focused)} />
          ),

        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={getColor(focused)} />
          ),

        }}
      />
      <Tabs.Screen
        name="bio"
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign name="profile" size={24} color={getColor(focused)} />
          ),

        }}
      />
    </Tabs>
  );
}
