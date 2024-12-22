import { StyleSheet, Text, View,ScrollView, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable } from 'react-native'; // Import Image component
import React, { useState, useEffect } from "react";
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("auth");
        if (token) {
          router.replace("/(tabs)/profile")
        }
      } catch (error) {
        console.log("Error", error)
      }
    }
    checkLoginStatus ()

  }, [])
  
  const handleLogin = async () => {
    try {
      const user = { email, password };
      const response = await axios.post("http://192.168.56.1:3000/login", user);
  
      if (response.data?.token) {
        await AsyncStorage.setItem("auth", response.data.token);
        router.replace("/(authenticate)/select");
      } else {
        console.log("Login failed: Invalid response");
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    
    <SafeAreaView style=
      {{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center"
      }}
    >

      <View style=
        {{
          height: 200,
          backgroundColor: "skyblue",
          width: "100%",
        }}
      >
        <View style=
          {{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 25
          }}
        >
          <Image

            style=
            {{
              width: 150,
              height: 80,
              resizeMode: "contain"
            }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2163/2163350.png", // Corrected to "uri"
            }}
          />
        </View>
        <Text style=
          {{
            marginTop: 20,
            textAlign: "center",
            fontSize: 20,
            fontFamily: "GillSans-SemiBold",
            fontWeight: "bold",
          }}
        >
          Roomie Matcher
        </Text>
      </View>
      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 25,
              color: "#3A7CA5"
            }}
          >
            Log in to your Account
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Image
            style={{ width: 150, height: 80, resizeMode: "cover" }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3664/3664065.png",
            }}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#87CEEB",
              paddingVertical: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons style={{ marginLeft: 8 }} name="email" size={24} color="white" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your email"
              placeholderTextColor={"white"}
              style={{
                color: "white",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 17 : 17,
              }}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#87CEEB",
                paddingVertical: 5,
                marginTop: 30,
              }}
            >
              <AntDesign style={{ marginLeft: 7 }} name="lock" size={24} color="black" />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                placeholder="Enter your password"
                placeholderTextColor={"white"}
                style={{
                  color: "white",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 17 : 17
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text>Keep me logged in</Text>

            <Text style={{ color: "#3A7CA5", fontWeight: "500" }}>Forgot Password</Text>
          </View>
          <View style={{ marginTop: 35 }} />
          <Pressable
              onPress={() => {
                console.log("Login button pressed!");
                handleLogin();
              }}
            style={{
              width: 200,
              backgroundColor: "#87CEEB",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold"
              }}
            >
              Login
            </Text>
          </Pressable>
          <Pressable onPress={() => router.replace("/register")} style={{ marginTop: 12 }}>
            <Text
              style={{
                textAlign: "center",
                color: "gray",
                fontSize: 16
              }}
            >
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    
  );
};

export default Login;

const styles = StyleSheet.create({


});