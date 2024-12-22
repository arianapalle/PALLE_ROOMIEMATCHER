import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import axios from "axios";
import { useRouter } from 'expo-router';

const index = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  const fetchReceivedLikesDetails = async () => {
    try{
      const response = await axios.get(
        `http://localhost:3000/received-likes/${userId}/details`
      );
      console.log(response);
      const ReceivedLikesDetails = response.data.ReceivedLikesDetails;
      setProfiles(ReceivedLikesDetails);
    } catch(error){
      console.log("Error fetching the details", error);
    }
  };

  const fetchUserMatches = async () => {
    try{
      const response = await axios.get(`http://localhost:3000/users/${userId}/matches`);
      const userMatches = response.data.matches;
      setMatches(userMatches);
    } catch(error){
      console.log("Error", error);
    }
  };

  useEffect(() => {
    if(userId){
      fetchReceivedLikesDetails();
    }
  }, [userId]);

  useEffect(() => {
    if(userId){
      fetchUserMatches();
    }
  }, [userId]);

  
  const Chats = [
    { id: 1, sender: 'John', message: 'Hey, how are you?', timestamp: '10:00 AM' },
    { id: 2, sender: 'Sarah', message: 'I’m looking for a roommate, are you interested?', timestamp: '10:05 AM' },
    { id: 3, sender: 'Jake', message: 'Let’s meet up this weekend!', timestamp: '10:10 AM' },
    { id: 4, sender: 'Emily', message: 'What are your preferences for the house?', timestamp: '10:15 AM' },
    { id: 5, sender: 'John', message: 'I prefer a quiet environment and a clean house.', timestamp: '10:20 AM' },
    { id: 6, sender: 'Sarah', message: 'That’s great, I’m also tidy and prefer a peaceful place.', timestamp: '10:25 AM' },
  ];

  return (
    <View style={{ backgroundColor: 'white', flex: 1, padding: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 20, fontWeight: '500' }}>
          Likes
        </Text>
        <Ionicons name="chatbox-ellipses-outline" size={25} color="black" />
      </View>

      <Pressable
        onPress={() =>
          router.push({
            pathname: '/chat/select',
            params: {
              profiles: JSON.stringify(profiles),
              userId: userId,
            },
          })
        }
        style={{ marginVertical: 12, flexDirection: 'row', alignItems: 'center' }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#E0E0E0',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Feather name="heart" size={24} color="black" />
        </View>
        <Text style={{ fontSize: 17, marginLeft: 10, flex: 1 }}>
          You have got {profiles?.length}2 likes
        </Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </Pressable>

      
      <View style={{ marginTop: 30 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 15,
            fontFamily: 'Optima',
          }}
        >
          Chats 💬
        </Text>
        {Chats.map((chat) => (
          <View
            key={chat.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              padding: 10,
              backgroundColor: '#f9f9f9',
              borderRadius: 8,
            }}
          >
            <View
              style={{
                backgroundColor: '#D3D3D3',
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {chat.sender[0]}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{chat.sender}</Text>
              <Text style={{ fontSize: 14, color: '#555' }}>
                {chat.message}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                color: '#888',
                marginLeft: 10,
              }}
            >
              {chat.timestamp}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
