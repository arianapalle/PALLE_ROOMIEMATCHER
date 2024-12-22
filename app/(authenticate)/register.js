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
            Register your Account
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
            <Ionicons style={{ marginLeft: 8 }} name="person-sharp" size={24} color="white" />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Enter your name"
              placeholderTextColor={"white"}
              style={{
                color: "white",
                marginVertical: 10,
                width: 300,
                fontSize: name ? 17 : 17,
              }}
            />
          </View>

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

          <View style={{ marginTop: 35 }} />
          <Pressable
            onPress={handleRegister}
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
              Register
            </Text>
          </Pressable>
          <Pressable onPress={() => router.replace("/login")} style={{ marginTop: 12 }}>
            <Text
              style={{
                textAlign: "center",
                color: "gray",
                fontSize: 16
              }}
            >
              already have an account? Sign in
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register

const styles = StyleSheet.create({})