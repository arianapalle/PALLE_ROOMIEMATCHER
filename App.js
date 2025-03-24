import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  Text,
  List,
  Card,
  Title,
} from "react-native-paper";

export default function App() {
  const [dailyCalorieLimit, setDailyCalorieLimit] = useState(2000);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [calorieInput, setCalorieInput] = useState("");

  const addCalories = () => {
    const calories = parseInt(calorieInput);
    if (isNaN(calories) || calories <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid number.");
      return;
    }
    setConsumedCalories(consumedCalories + calories);
    setCalorieInput("");

    if (consumedCalories + calories > dailyCalorieLimit) {
      Alert.alert(
        "Warning: Overeating",
        "You have exceeded your daily calorie limit! Try eating lighter meals."
      );
    }
  };

  const getMealSuggestions = () => {
    if (consumedCalories > dailyCalorieLimit) {
      return [
        "Light Salad with Vegetables",
        "Grilled Fish with Lemon",
        "Low-Calorie Smoothie",
      ];
    }
    return [
      "Grilled Chicken and Quinoa",
      "Avocado and Egg Toast",
      "Fruit and Yogurt Bowl",
    ];
  };

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <Appbar.Header>
        <Appbar.Content title="Diet & Calorie Tracker" />
      </Appbar.Header>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Calorie Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Daily Stats</Title>
            <Text>Calorie Limit: {dailyCalorieLimit}</Text>
            <Text
              style={{
                color: consumedCalories > dailyCalorieLimit ? "red" : "green",
              }}
            >
              Calories Consumed: {consumedCalories}
            </Text>
          </Card.Content>
        </Card>

        {/* Calorie Input */}
        <TextInput
          mode="outlined"
          label="Enter Calories"
          value={calorieInput}
          keyboardType="numeric"
          onChangeText={setCalorieInput}
          style={styles.input}
        />
        <Button mode="contained" onPress={addCalories} style={styles.button}>
          Add Calories
        </Button>

        {/* Meal Recommendations */}
        <Title style={styles.sectionTitle}>Meal Recommendations</Title>
        <FlatList
          data={getMealSuggestions()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <List.Item
              title={item}
              left={(props) => <List.Icon {...props} icon="food" />}
            />
          )}
        />
      </View>
    </View>
  );
}