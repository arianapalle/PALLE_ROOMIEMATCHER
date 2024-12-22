import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'

const select = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Safely parse profiles, handle the case where it's undefined or invalid JSON
  let profiles = [];
  if (params?.profiles) {
    try {
      profiles = JSON.parse(params.profiles);
    } catch (error) {
      console.error("Error parsing profiles:", error);
      profiles = []; // Default to an empty array if parsing fails
    }
  }

  const userId = params?.userId;

  return (
    <ScrollView
      style={{
        backgroundColor: "white",
        flex: 1,
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* Categories */}
        <View
          style={{
            backgroundColor: "#F0F0F0",
            padding: 10,
            borderRadius: 18
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Optima",
            }}
          >
            Possible Roommate 😇
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#F0F0F0",
            padding: 10,
            borderRadius: 18
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Optima",
            }}
          >
            Looking For 👭🏻
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#F0F0F0",
            padding: 10,
            borderRadius: 18
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Optima",
            }}
          >
            Preferences 🤝
          </Text>
        </View>
      </View>

      {/* Check if profiles exist */}
      {profiles.length > 0 ? (
        <View style={{ marginTop: 20 }}>
          {profiles.map((item, index) => (
            <View key={index} style={{ marginVertical: 15 }}>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 50
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 17, fontWeight: "600" }}>
                      {item?.name}
                    </Text>
                    <Text
                      style={{
                        width: 200,
                        marginTop: 15,
                        fontSize: 18,
                        lineHeight: 24,
                        fontFamily: "Optima",
                        marginBottom: 8,
                      }}
                    >
                      {item?.description?.length > 160
                        ? item?.description
                        : item?.description.substr(0, 160)}
                    </Text>
                  </View>

                  {item?.profileImages?.slice(0, 1).map((image, index) => (
                    <Image
                      key={index}
                      style={{
                        width: 280,
                        height: 280,
                        resizeMode: "cover",
                        borderRadius: 5,
                      }}
                      source={{ uri: image }}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          ))}
        </View>
      ) : (
        <View>
          <Text>No profiles available</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default select

const styles = StyleSheet.create({});
