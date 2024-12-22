import { StyleSheet, Text, View, ScrollView, Image, Pressable, TextInput, FlatList, Button, Alert } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router'; 
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const index = () => {
  const [option, setOption] = useState("AD");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [lookingOptions, setLookingOptions] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState([]);
  const router = useRouter();
  
  console.log("User Id", userId)
  const logout = async () => {
    try {
      // Remove authentication token
      await AsyncStorage.removeItem("auth");

      // Navigate to the login screen
      router.push("/(authenticate)/login"); // Ensure this path is correct
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        setUserId(userId);
      }
    };

    fetchUser();
  }, []);

  const profileImages = [
    {
      image: "https://images.pexels.com/photos/2688192/pexels-photo-2688192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      image: "https://images.pexels.com/photos/2687998/pexels-photo-2687998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      image: "https://images.pexels.com/photos/2694130/pexels-photo-2694130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
  ];

  const preferences = [
    {
      id: "0",
      name: "Limited Budget",
      description: "Budget is only below 3000",
    },
    {
      id: "0",
      name: "Flexible Budget",
      description: "Budget is above 3000",
    },
    {
      id: "10",
      name: "Clean",
      description:
        " If you want a clean roommate.",
    },
    {
      id: "1",
      name: "Lifestyle",
      description:
        "If interested in Lifestyle that can affect your living conditions",
    },
    {
      id: "2",
      name: "Habits",
      description:
        "If interested in Habits that can affect your living conditions",
    },
    {
      id: "3",
      name: "Attitude",
      description: "If interested in Attitude that can affect your living conditions ",
    },
  ];

  const data = [
    {
      id: "0",
      name: "Looking to Move Soon",
      description: "Ready to move in the next month",
    },
    {
      id: "0",
      name: "Looking to Move now",
      description: "Ready to move in this week",
    },
    {
      id: "1",
      name: "Long Term Roommate",
      description: "At least 1 year roommate",
    },
    {
      id: "1",
      name: "Short Term Roommate",
      description: "At least 6 months roommate",
    },
    {
      id: "2",
      name: "Fixed-Term Lease",
      description: "Interested in a lease for a specific period",
    },
    {
      id: "2",
      name: "Flexible-Term Lease",
      description: "Interested in a flexible lease",
    },

    {
      id: "3",
      name: "Flexible Arrangement",
      description: "Open to different roommate arrangements",
    },

    {
      id: "3",
      name: "Strict Arrangement",
      description: "Not Open to different roommate arrangements",
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);
  const fetchUserDescription = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      console.log(response);
      const user = response.data;

      setDescription(user?.user?.description);
      setSelectedPreferences(user.user?.preferences);
      setImages(user?.user.profileImages);
      setLookingOptions(user?.user.lookingFor)
    } catch (error) {
      console.log("Error fetching user description", error)
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUserDescription()

    };
  }, [userId])
  const updateUserDescription = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/users/${userId}/description`, {
        description: description,
      });

      console.log(response.data);

      if (response.status === 200) {
        Alert.alert("Success", "Description updated successfully");
      }
    } catch (error) {
      console.log("Error updating the user Description");
    }

  };
  const handleTogglePreference = (preferences) => {
    if (selectedPreferences.includes(preferences)) {
      removePreference(preferences);
    } else {
      addPreference(preferences);
    }
  };

  const handleOption = (lookingFor) => {
    if (lookingOptions.includes(lookingFor)) {
      removeLookingFor(lookingFor);
    } else {
      addLookingFor(lookingFor);
    }
  };

  const addLookingFor = async (lookingFor) => {
    try {
      const response = await axios.put(`http://localhost:3000/users/${userId}/looking-for`, {
        lookingFor: lookingFor,
      });

      console.log(response.data);

      if (response.status == 200) {
        setLookingOptions([...lookingOptions, lookingFor])
      }
    } catch (error) {
      console.log("Error adding looking for", error)
    }
  };
  const removeLookingFor = async (lookingFor) => {
    try{
      const response = await axios.put(`http://localhost:3000/users/${userId}/looking-for/remove`, {
          lookingFor:lookingFor,
      });

      console.log(response.data);

      if(response.status == 200){
          setLookingOptions(lookingOptions.filter((item) => item !== lookingFor));
      }
    }catch (error){
      console.error("Error removing looking for", error);
    }
};
  const addPreference = async (preferences) => {
    try {
      const response = await axios.put(`http://localhost:3000/users/${userId}/preferences/add`,
        {
          preferences: preferences
        }
      );

      console.log(response.data);

      if (response.status == 200) {
        setSelectedPreferences([...selectedPreferences, preferences])
      }
    } catch (error) {
      console.log("Error adding preferences", error);
    }
  };
  const removePreference = async (preferences) => {
    try {
      const response = await axios.put(`http://localhost:3000/users/${userId}/preferences/remove`, {
        preferences: preferences
      });

      console.log(response.data);

      if (response.status == 200) {
        setSelectedPreferences(selectedPreferences.filter((item) => item !== preferences))
      }

    } catch (error) {
      console.log("Error removing preference", error)
    }
  };
  const renderImage = ({ item }) => (
    <View style={{ width: 300, justifyContent: "center", alignItems: "center", marginHorizontal: 10 }}>
      <Image
        style={{
          width: '100%',
          height: 290,
          borderRadius: 10,
          resizeMode: 'cover',
          transform: [{ rotate: '-5deg' }],
        }}
        source={{ uri: item }}
      />
    </View>
  );

  const handleAddImage = async () => {
    try{
      const response = await axios.post(`http://localhost:3000/users/${userId}/profile-images`, {
        imageUrl:imageUrl
      });

      console.log(response);

      setImageUrl("")
    } catch(error){
        console.log("error", error)
    }
  }
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex]
  }

  const randomImage = getRandomImage ()
  return (
    <ScrollView>
      <View>
        <Image
          style={{ width: "100%", height: 200, }}

          source={{
            uri: "https://images.pexels.com/photos/29586675/pexels-photo-29586675/free-photo-of-abstract-wavy-line-art-on-gradient-background.jpeg",
          }}
        />
        <View>
          <View>
            <Pressable onPress={() => console.log('Image Pressed!')} style=
              {{
                padding: 10,
                backgroundColor: "#87CEEB",
                width: 300,
                marginLeft: "auto",
                marginRight: "auto",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                position: "absolute",
                top: -60,
                left: "50%",
                transform: [{ translateX: -150 }]

              }}>
              <Image
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  resizeMode: 'cover',

                }}
                source={{
                  uri: randomImage
                }}
              />
              <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 6 }}>Cagayan de Oro</Text>
              <Text style={{ marginTop: 4, fontSize: 15 }}>21 years 120 days</Text>
            </Pressable>

          </View>
        </View>
      </View>
      
      <View style={{ flex: 1 }}>
        {/* Logout Button */}
        <Pressable
          onPress={logout}
          style={{
            position: "absolute",
            top: 40,
            right: 20,
            padding: 10,
            backgroundColor: "white",
            borderRadius: 50,
            elevation: 4, // Shadow for Android
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
          <MaterialIcons name="logout" size={24} color="black" />
        </Pressable>

      </View>
      
      <View
        style={{
          marginTop: 80,
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 25,
          justifyContent: "center"

        }}
      >

        <Pressable onPress={() => setOption("AD")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option == "AD" ? "black" : "gray",
            }}
          >
            AD
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Photos")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option == "Photos" ? "black" : "gray",
            }}
          >
            Photos
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Preferences")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option == "Preferences" ? "black" : "gray",
            }}
          >
            Preferences
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Looking For")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option == "Looking For" ? "black" : "gray",
            }}
          >
            Looking For
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Verify")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option == "Verify" ? "black" : "gray",
            }}
          >
            Verify
          </Text>
        </Pressable>

      </View>
      

      <View style={{ marginHorizontal: 14, marginVertical: 15 }}>
        {option == "AD" && (
          <View
            style={{
              borderColor: "#202020",
              borderWidth: 1,
              padding: 10,
              borderRadius: 10,
              height: 300,

            }}
          >
            <TextInput
              value={description}
              multiline
              onChangeText={(text) => setDescription(text)}
              style={{ fontFamily: "Helvetica", fontSize: description ? 17 : 17 }}
              placeholder="Write your AD for people to match you"
              placeholderTextColor="#A9A9A9"
            // can be black
            />

            <Pressable
              onPress={updateUserDescription}
              style={{
                marginTop: "auto",
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
                backgroundColor: "black",
                borderRadius: 5,
                justifyContent: "center",
                padding: 10
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: "500"
                }}
              >
                Publish in feed
              </Text>
              <Entypo name="mask" size={24} color="white" />

            </Pressable>


          </View>

        )}
      </View>

      <View style={{ marginHorizontal: 14 }}>
        {option === "Photos" && (
          <View>
            <FlatList
              data={images}
              renderItem={renderImage}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false} // Optional for cleaner look
              contentContainerStyle={{ paddingVertical: 10 }}

            />
            <View style={{ marginTop: 25 }}>
              <Text>Add a picture of yourself</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginTop: 10,
                  backgroundColor: "#DCDCDC",

                }}
              >
                <Entypo style={{ marginLeft: 8 }} name="image" size={24} color="grey" />
                <TextInput
                value={imageUrl}
                onChangeText={(text) => setImageUrl(text)}
                  style={{
                    color: "gray",
                    marginVertical: 10,
                    width: 300
                  }}
                  placeholder="Add your image url"
                  placeholderTextColor="#A9A9A9"
                />
              </View>
              <Button onPress={handleAddImage} style={{ marginTop: 5 }} title="Add Image" />
            </View>

          </View>
        )}
      </View>

      <View style={{ marginHorizontal: 14 }}>
        {option == "Preferences" && (
          <View>
            {preferences?.map((item, index) => (
              <Pressable
                onPress={() => handleTogglePreference(item?.name)}
                style={{
                  backgroundColor: "#FFFDD0",
                  padding: 10,
                  marginVertical: 10,

                }}
                key={index}
              >
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 15,
                      fontWeight: "bold",
                      flex: 1,
                    }}
                  >
                    {item?.name}
                  </Text>
                  {selectedPreferences.includes(item?.name) && (
                    <AntDesign name="checkcircle" size={18} color="#17b169" />
                  )}
                </View>
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 15,
                    color: "gray",
                    textAlign: "center"
                  }}>
                  {item?.description}
                </Text>
              </Pressable>


            ))}
          </View>
        )}
      </View>

      <View style={{ marginHorizontal: 14 }}>
        {option == "Looking For" && (
          <>
            <View>
              <FlatList
                columnWrapperStyle={{ justifyContent: "space-between" }}
                numColumns={2}
                data={data}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleOption(item?.name)}
                    style={{
                      backgroundColor: lookingOptions.includes(item?.name)
                        ? "#5c9dfd"
                        : "white",
                      padding: 16,
                      justifyContent: "center",
                      alignItems: "center",
                      width: 150,
                      margin: 10,
                      borderRadius: 5,
                      borderColor: "#87CEEB",
                      borderWidth: lookingOptions.includes(item?.name)
                        ? "transparent"
                        : 0.7,
                    }}
                  >

                    <Text style={{
                      textAlign: "center",
                      fontWeight: "500",
                      fontSize: 13,
                      color: lookingOptions.includes(item?.name)
                        ? "white"
                        : "black",
                    }}>{item?.name}</Text>
                    <Text
                      style={{
                        color: lookingOptions.includes(item?.name)
                        ? "white"
                        : "grey",
                        textAlign: "center",
                        width: 140,
                        marginTop: 10,
                        fontSize: 13,

                      }}>{item?.description}</Text>
                  </Pressable>

                )}
              />

            </View>

          </>

        )}

      </View>
      
      <View style={{ marginHorizontal: 14 }}>
      {option == "Verify" && (
    <>
      <View>
        {/* Verification Form Section */}
        <Text style={{ fontWeight: "500", fontSize: 18, marginBottom: 10 }}>
          Please upload your documents for verification.
        </Text>

        {/* COR (Certificate of Registration) */}
        <TextInput
          style={{
            backgroundColor: "white",
            padding: 16,
            marginVertical: 8,
            borderRadius: 5,
            borderColor: "#87CEEB",
            borderWidth: 0.7,
            fontSize: 14,
          }}
           placeholder="COR (Certificate of Registration)"
        />
        
        {/* School ID */}
        <TextInput
          style={{
            backgroundColor: "white",
            padding: 16,
            marginVertical: 8,
            borderRadius: 5,
            borderColor: "#87CEEB",
            borderWidth: 0.7,
            fontSize: 14,
          }}
            placeholder="School ID"
        />
      </View>
    </>
  )}
</View>

  </ScrollView>
  );
};

export default index

const styles = StyleSheet.create({})