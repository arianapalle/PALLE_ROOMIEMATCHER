import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, TextInput, KeyboardAvoidingView, Alert, } from 'react-native';
import React, { useState } from "react";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import axios from "axios";

const register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    if (!name || !email || !password) {
      Alert.alert("All fields are required", "Please fill in all fields.");
      return;
    }

    const user = {
      name: name,
      email: email,
      password: password,
    };
    axios
    .post("http://192.168.56.1:3000/register", user)
    .then((response) => {
      console.log(response);
      Alert.alert(
        "Registration Successful", 
        "You have been registered succesfully", 
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form after successful registration
              setEmail("");
              setName("");
              setPassword("");
              router.replace("/login");  // Optionally navigate to login page
            },
          },
        ]
      );
    })
    .catch((error) => {
      console.log("Error registering user:", error.response ? error.response.data : error.message);
      Alert.alert("Registration failed", "An error occurred during registration");
    });
};

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.LogoContainer}> 
      <Image source={require("../../assets/RMLogo.png")} style={{ width: 70, height: 70, margin:10}}/>
      <Text style={styles.AppName}>Roomie Matcher</Text>
      </View>

      <View style={styles.ItemContainer}>
        <Text style={styles.RegAcc}>Register Account</Text>
       
        <View style={styles.InputContainer}>
          <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Username"
              placeholderTextColor={"#87CEEB"}
              style={styles.InputBox}
            />

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

          <Pressable
            onPress={handleRegister}
            style={{
              width: 150,
              backgroundColor: "#6DC9EF",
              borderRadius: 50,
              padding: 13,
              marginTop: 40,
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
              Register
            </Text>
          </Pressable>

          <Pressable onPress={() => router.replace("/login")} style={{ marginTop: 20 }}>
            
            <Text
              style={{
                textAlign: "center",
                color: "gray",
                fontSize: 15
              }}
            >
              already have an account? Sign in
            </Text>
          </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default register

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
  RegAcc: {
    marginTop: -20,
    marginBottom: 40,
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
})