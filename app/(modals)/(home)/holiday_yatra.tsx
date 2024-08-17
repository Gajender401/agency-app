import { StyleSheet, Text, View, Image, Dimensions, SafeAreaView, TextInput, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from "@/constants/Colors";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from 'expo-router';
import Carousel from "@/components/Carousel";
import PhoneNumbersList from '@/components/PhoneNumberList';
import { useGlobalContext } from '@/context/GlobalProvider';

const { width, height } = Dimensions.get('window');

const holiday_yatra = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [tours, setTours] = useState([])
  const { apiCaller, setRefresh } = useGlobalContext();

  // const images = [
  //   require('@/assets/images/carousel1.png'),
  //   require('@/assets/images/carousel1.png'),
  //   require('@/assets/images/carousel1.png'),
  //   require('@/assets/images/carousel1.png'),
  // ];

  const phoneNumbers = ['7249005806', '7249005807']; // Example list of numbers

  const fetchTours = async () => {
    setIsLoading(true)
    try {
      const res = await apiCaller.get("/api/tour")
      setTours(res.data.data)
      setRefresh(prev => !prev)
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add route. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    fetchTours()
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* <Text>holiday_yatra</Text>
          <Text onPress={() => router.push('/add_holiday_yatra')}>Add form</Text> */}

          <View style={styles.searchContainer}>
            <TouchableOpacity>
              <FontAwesome5 name="search" size={18} color={Colors.secondary} />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor={Colors.secondary}
            />
          </View>

          <TouchableOpacity onPress={() => router.push("add_holiday_yatra")} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Yatra</Text>
          </TouchableOpacity>

          {
            isLoading ? (
              <ActivityIndicator size="large" color={Colors.darkBlue} />
            ) :
              tours.map((tour) => {
                return <TourCard tour={tour} />
              })
          }



        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default holiday_yatra;

const TourCard = ({ tour }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: tour.photo }} height={400} />

      <Text style={styles.cardText}>{tour?.agencyName}<Text style={{ color: "black" }}></Text></Text>
      <View style={{ padding: 1 }}>
        <PhoneNumbersList phoneNumbers={[tour?.primaryMobileNumber, tour?.secondaryMobileNumber]} />
      </View>
      <Text style={styles.cardText}>Office Address: {tour?.officeAddress} <Text style={{ color: "black" }}></Text></Text>
      <Text style={styles.cardText}>Tour Name: {tour?.name}<Text style={{ color: "black" }}></Text></Text>
      <Text style={styles.cardText}>Location: {tour?.location}<Text style={{ color: "black" }}></Text></Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    paddingVertical: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: Colors.secondary,
  },
  card: {
    backgroundColor: "#fff",
    padding: 1,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
  },
  cardText: {
    marginBottom: 1,
    color: Colors.secondary,
    fontWeight: "500",
    fontSize: 12,
  },
  image: {
    width: '100%', // Full width of the container
    height: height * 0.3, // Adjusted height to 30% of screen height
  },
  addButton: {
    backgroundColor: Colors.darkBlue,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    marginBottom: 10,
    width: 120
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
