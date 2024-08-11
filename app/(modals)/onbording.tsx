import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

const OnboardingScreen = () => {
  const handleNext = () => {
    router.push("/(modals)/customerOrAgency");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />
      <View style={styles.innerContainer}>
        <Image style={styles.image} source={require('@/assets/images/onboarding.png')} />
        <Text style={styles.titleText}>
          Find & connect with trusted mechanics near you.
        </Text>
        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: StatusBar.currentHeight,
  },
  innerContainer: {
    flex: 1,
    marginTop: 150,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  titleText: {
    fontWeight: "500",
    fontSize: 18,
    color: Colors.primary,
    textAlign: "center",
  },
  button: {
    borderRadius: 30,
    borderWidth: 1,
    paddingVertical: 10,
    width: "85%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 21,
  },
  wave_image: {
    width: "110%",
    position: "absolute",
    height: 300,
},
});

export default OnboardingScreen;
