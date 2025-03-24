import React from "react";
import { StyleSheet, View, Text, Pressable, SafeAreaView, Image } from "react-native";
import { useRouter } from "expo-router";


const landingPage = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require("../../assets/RMLogo.png")} style={{ width: 150, height: 150, margin:10}}/>

          <View>
            <Text style={styles.AppName}>Roomie Matcher</Text>
          </View>

          <View style={styles.Button}>
            <Pressable onPress={() => router.push("login")}>              
              <Text style={styles.ButtonText}>Start Now</Text>
            </Pressable>
          </View>
        </SafeAreaView>
    );
};

export default landingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff", 
  },
  AppName: {
    fontSize: 30,
    fontWeight: 700,
    color: "#87CEEB",
  },
  Button: {
    margin: 30,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#87CEEB",

  },
  ButtonText: {
    fontSize: 17,
    fontWeight: 700,
    color: "#fff",
  },


});
