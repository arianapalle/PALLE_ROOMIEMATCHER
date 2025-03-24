import { StyleSheet, Text, View, SafeAreaView, Image, pressed, TextInput, Pressable } from 'react-native'; // Import Image component
import React, { useState, useEffect } from "react";
import { useRouter } from 'expo-router';
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
    
    <SafeAreaView style={styles.container}>

      <View style={styles.LogoContainer}> 
      <Image source={require("../../assets/RMLogo.png")} style={{ width: 70, height: 70, margin:10}}/>
      <Text style={styles.AppName}>Roomie Matcher</Text>
      </View>

      <View style={styles.ItemContainer}>
        <Text style={styles.LoginAcc}>Log in to your Account</Text>

          <View style={styles.InputContainer}>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email address"
              placeholderTextColor={"#87CEEB"}
              style={styles.InputBox}
            />

            <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor={"#87CEEB"}
                style={styles.InputBox}
              />
          </View>


          <View style={styles.DecorTxt}>
            <Text style={styles.TextLang}>Keep me logged in</Text>
            <Text style={styles.TextLang}>Forgot Password</Text>
          </View>

          <Pressable
              onPress={() => {
                console.log("Login button pressed!");
                handleLogin();
              }}
            style={{
              width: 150,
              backgroundColor: "#6DC9EF",
              borderRadius: 50,
              padding: 13,
              marginTop: 50,
              opacity: pressed ? 0.7 : 1,
              }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Login
            </Text>
          </Pressable>
          
          <Pressable onPress={() => router.replace("/register")} style={{ marginTop: 20 }}>
            <Text
              style={{
                textAlign: "center",
                color: "gray",
                fontSize: 15,
              }}
            >
              Don't have an account? Sign Up
            </Text>
          </Pressable>
      </View>
    </SafeAreaView>
    
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff", 
  },
  LogoContainer:{
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  AppName: {
    fontSize: 20,
    fontWeight: 700,
    color: "#87CEEB",
  },
  ItemContainer:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff", 
    backgroundColor: "#9FDBF4", 
    borderTopLeftRadius: 40,  
    borderTopRightRadius: 40, 
  },
  LoginAcc: {
    marginTop: -40,
    marginBottom: 50,
    fontSize: 26,
    fontWeight: 700,
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)", 
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 4,
  },
  InputBox: {
    marginVertical: 15,
    width: 330,
    fontSize: 16,
    padding: 13,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  DecorTxt: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 100,
  },
  
  TextLang: {
    color: "#585F62",
  }
});