import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Button,
  Image
} from "react-native";
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";

import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Picker } from '@react-native-picker/picker';
import Carousel from "@/components/Carousel";
import CustomButton from "@/components/CustomButton"
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import PhoneNumbersList from "@/components/PhoneNumberList";
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


interface BlurOverlayProps {
  visible: boolean;
  onRequestClose: () => void;
}

const BlurOverlay: React.FC<BlurOverlayProps> = ({ visible, onRequestClose }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <TouchableWithoutFeedback onPress={onRequestClose}>
      <BlurView intensity={90} tint="light" style={styles.overlay} />
    </TouchableWithoutFeedback>
  </Modal>
);

function timestampToTime(timestamp: string): string {
  const date = new Date(timestamp);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = hours.toString().padStart(2, '0');

  return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

const DailyRouteVehicles: React.FC = () => {
  
  const [dailyRoutes, setDailyRoutes] = useState<DailyRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<DailyRoute | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [selectedPrimaryDriver, setSelectedPrimaryDriver] = useState<string>("");
  const [selectedSecondaryDriver, setSelectedSecondaryDriver] = useState<string>("");
  const [selectedCleaner, setSelectedCleaner] = useState<string>("");
  const [instruction, setInstruction] = useState("")
  const [searchQuery, setSearchQuery] = useState("");
  const { apiCaller, setEditData, refresh } = useGlobalContext();
  const [inputHeight, setInputHeight] = useState(50);
  // const [modalVisible, setModalVisible] = useState(false);

  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [driverModalVisible, setDriverModalVisible] = useState(false);
  const [chartModalVisible, setChartModalVisible] = useState(false);
  const [discountAmount, setDiscountAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


  // const handleOpenModal = () => {
  //   if (!modalVisible) {
  //     setModalVisible(true);
  //   }
  // };

  const fetchDailyRoutes = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get('/api/dailyRoute');
      setDailyRoutes(response.data.data);
      console.log(response.data.data[0].vehicle.number);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get('/api/driver');
      setDrivers(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCleaners = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get('/api/cleaner');
      setCleaners(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyRoutes();
    fetchDrivers();
    fetchCleaners();
  }, [refresh]);

  const handleDelete = async () => {
    if (selectedRoute) {
      try {
        await apiCaller.delete(`/api/dailyRoute?dailyRouteId=${selectedRoute._id}`);
        fetchDailyRoutes();
        setShowDeleteModal(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCreateDiscount = () => {
    // Handle the discount amount here
    console.log('Discount Amount:', discountAmount);
    setModalVisible(false); // Close the modal after creating the discount
  };

  const handleAddDriver = async () => {
    if (!selectedPrimaryDriver && !selectedSecondaryDriver && !selectedCleaner && !instruction) {
      Alert.alert("Please fill at least one field.");
      return;
    }

    const newDriverData = {
      primaryDriverId: selectedPrimaryDriver || null,
      secondaryDriverId: selectedSecondaryDriver || null,
      cleanerId: selectedCleaner || null,
      instructions: instruction || ""
    };

    try {
      setLoading(true);
      await apiCaller.patch(`/api/dailyRoute/finalize?routeId=${selectedRoute?._id}`, newDriverData);
      Alert.alert("Success", "Drivers and cleaner added successfully!");
      fetchDailyRoutes();
      setShowAddDriverModal(false);
    } catch (error) {
      console.error("Error adding drivers and cleaner:", error);
      Alert.alert("Error", "Failed to add drivers and cleaner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterDailyRoutes = (query: string) => {
    return dailyRoutes.filter((route) =>
      Object.values(route).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
  };
  const images = [
    require('@/assets/images/carousel1.png'),
    require('@/assets/images/carousel1.png'),
    require('@/assets/images/carousel1.png'),
    require('@/assets/images/carousel1.png'),
  ];


  const phoneNumbers = ['7249005806', '7249005807', '7249005808', '7249005808']; // Example list of numbers


  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={18} color={Colors.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={Colors.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <TouchableOpacity onPress={() => router.push("add_daily_route_vehicles")} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Route</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.darkBlue} />
      ) : (
        <ScrollView style={styles.routesList}>
          {filterDailyRoutes(searchQuery).map((route) => (
            <View key={route._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <TouchableOpacity style={styles.editButton} onPress={() => {
                  setSelectedRoute(route);
                  setShowAddDriverModal(true);
                }}>
                  <Text style={styles.editButtonText}>Add Driver</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setEditData(route); router.push("edit_daily_route_vehicles") }} style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit Route</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                      backgroundColor: '#87CEEB',
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderRadius: 5,
                    }}
                    onPress={() => setModalVisible(true)}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>Create Discount</Text>
                  </TouchableOpacity>

                <TouchableOpacity onPress={() => { setShowDeleteModal(true); setSelectedRoute(route); }}>
                  <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ position: 'relative' }}>
                  <Carousel images={images} />
                  <View style={styles.circle}>
                    <Text style={styles.circleText}>AC</Text>
                    <Text style={styles.circleText}>Sleeper</Text>
                    <Text style={styles.circleText}>{route.vehicle.number.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
              <View >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '900',
                  color: '#87CEEB',
                  fontFamily: 'sans-serif',
                  textAlign:'center'
                }}
              >
                Tusharraj Travels
              </Text>
            </View>


    <View style={{ width: "100%", paddingHorizontal:40 }}>
      {/* Departure and Arrival Labels */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {/* Departure Label */}
        <View style={{ alignItems: "flex-start" }}>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>Departure</Text>
        </View>

        {/* Arrival Label */}
        <View style={{ alignItems: "flex-start" }}>
          <Text style={{ fontWeight: "bold", fontSize: 15, paddingRight:13 }}>Arrival</Text>
        </View>
      </View>
      
      {/* Departure and Arrival Places with Times */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 1 }}>
        {/* Departure Place and Time */}
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, color: "#87CEEB" }}>
            {route.departurePlace}
          </Text>
          <Text>12:30 pm</Text>
        </View>

        {/* Arrow Icon */}
        <MaterialIcons name="keyboard-double-arrow-right" size={24} color="#00008B" />

        {/* Arrival Place and Time */}
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, color: "#87CEEB" }}>
            {route.destinationPlace}
          </Text>
          <Text style={{ marginBottom:14 }} >11:11 pm</Text>
        </View>
      </View>
    </View>
{/* 
              <Text style={styles.cardText}>
                Vehicle Number: <Text style={{ color: "black" }}>{route.vehicle.number.toUpperCase()}</Text>
              </Text> */}
             
              
              <Text style={styles.cardText }>
                Pick Up Point: Pune
              </Text>
              <Text style={styles.cardText}>
                Dropping Point: delhi
              </Text>
              <Text style={styles.cardText}>
                Ticket Price: 500
              </Text>
                        
              <View>
                   <Text style={{ flex: 1, fontWeight: 'bold',  fontSize: 12,}}>Office Address: sai nagar osmanabad </Text>
              </View>
              <View>
                   <Text style={{ flex: 1, fontWeight: 'bold',  fontSize: 12, marginBottom:4}}>Phone Pe No: 7249005806 </Text>
              </View>
              <Text style={{ flex: 1, fontWeight: 'bold', color:'#87CEEB'}}>Amenities:</Text>
              <View style={{
                    paddingTop:1,
                    paddingBottom:14,
                    flexDirection:'row',
                    
                  }}>
               
                   <Image
                      source={require('@/assets/images/wifi-icon.png')}
                      style={{ width: 30, height: 30, marginHorizontal: 5 }}
                    />
                   <Image
                      source={require('@/assets/images/blanket.png')}
                      style={{ width: 30, height: 30, marginHorizontal: 5 }}
                    />
                   <Image
                      source={require('@/assets/images/bottle.png')}
                      style={{ width: 30, height: 30, marginHorizontal: 5 }}
                    />
                   <Image
                      source={require('@/assets/images/charger.png')}
                      style={{ width: 30, height: 30, marginHorizontal: 5 }}
                    />
                   <Image
                      source={require('@/assets/images/meal.png')}
                      style={{ width: 30, height: 30, marginHorizontal: 5 }}
                    />
                   <Image
                      source={require('@/assets/images/pillow.png')}
                      style={{ width: 30, height: 30, marginHorizontal: 5 }}
                    />
                   <Image
                      source={require('@/assets/images/tv.png')}
                      style={{ width: 30, height: 30, marginHorizontal: 5 }}
                    />           
              </View>

              <View style={{ padding: 1 }}>
                 <PhoneNumbersList phoneNumbers={phoneNumbers} />
              </View>
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 1,
                    }}
                  >
                    <Text style={{ flex: 1, fontWeight: 'bold', color: '#87CEEB' }}>Courier Services</Text>
                    <Text style={{ flex: 1, fontWeight: 'bold', color: '#87CEEB' }}>Train Ticket</Text>
                    <Text style={{ flex: 1, fontWeight: 'bold', color: '#87CEEB' }}>Two Wheeler Courier</Text>
                  </View> */}
              <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
       
       <View style={{ padding: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingTop:14 }}>
        {/* Column for Courier Service and QR Code Button */}
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 12,
              marginBottom: 5,
              backgroundColor: '#e6f2ff', // Yellow background
              paddingVertical: 5,
              paddingHorizontal: 6,
              borderRadius: 5, // Optional: rounded corners
            }}
          >
            Courier Service
          </Text>
          <CustomButton
            title="View QR Code"
            onPress={() => setQrModalVisible(true)}
          />
        </View>

        {/* Column for Train Ticket and Driver Button */}
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 12,
              marginBottom: 5,
              backgroundColor: '#e6f2ff', // Yellow background
              paddingVertical: 5,
              paddingHorizontal: 6,
              borderRadius: 5, // Optional: rounded corners
            }}
          >
            Train Ticket
          </Text>
          <CustomButton
            title="View Driver"
            onPress={() => setDriverModalVisible(true)}
          />
        </View>

        {/* Column for Two Wheeler Courier and Chart Button */}
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 12,
              marginBottom: 5,
              backgroundColor: '#e6f2ff', 
              paddingVertical: 5,
              paddingHorizontal: 2,
              borderRadius: 5, // Optional: rounded corners
            }}
          >
            Two Wheeler Courier
          </Text>
          <CustomButton
            title="View Chart"
            onPress={() => setChartModalVisible(true)}
          />
        </View>
      </View>
    </View>
      {/* Modal for displaying QR code */}
      <Modal
        transparent={true}
        visible={qrModalVisible}
        animationType="slide"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: '80%',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              Scan this QR Code:
            </Text>
            <Image
              source={require('@/assets/images/vehicle_documents.png')} // Replace with your QR code image URL
              style={{ width: 200, height: 200 }}
            />
            <CustomButton
              title="Close"
              onPress={() => setQrModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

       {/* Modal for Discount Entry */}
       <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: '80%',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              Enter Discount Amount
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                marginBottom: 20,
                paddingRight: 10, // padding for the icon
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  padding: 10,
                  fontSize: 16,
                  textAlign: 'center', // center the cursor
                }}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={discountAmount}
                onChangeText={setDiscountAmount}
              />
              <MaterialCommunityIcons
                name="percent"
                size={24}
                color="#000" // You can change the color as needed
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#4CAF50',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                }}
                onPress={handleCreateDiscount}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#4CAF50',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for displaying driver information */}
      <Modal
        transparent={true}
        visible={driverModalVisible}
        animationType="slide"
        onRequestClose={() => setDriverModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: '80%',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, marginVertical: 5 }}>
              Cleaner Name:{' '}
              <Text style={{ color: 'black' }}>
                {route.cleaner ? route.cleaner.name : ''}
              </Text>
            </Text>
            <Text style={{ fontSize: 16, marginVertical: 5 }}>
              Primary Driver:{' '}
              <Text style={{ color: 'black' }}>
                {route.primaryDriver ? route.primaryDriver.name : ''}
              </Text>
            </Text>
            <Text style={{ fontSize: 16, marginVertical: 5 }}>
              Secondary Driver:{' '}
              <Text style={{ color: 'black' }}>
                {route.secondaryDriver ? route.secondaryDriver.name : ''}
              </Text>
            </Text>
            <CustomButton
              title="Close"
              onPress={() => setDriverModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Modal for displaying chart */}
      <Modal
        transparent={true}
        visible={chartModalVisible}
        animationType="slide"
        onRequestClose={() => setChartModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: '80%',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              Here is your chart:
            </Text>
            <Image
              source={{ uri: 'https://example.com/your-chart.png' }} // Replace with your chart image URL
              style={{ width: 200, height: 200 }}
            />
            <CustomButton
              title="Close"
              onPress={() => setChartModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
               

              
            </View>
          ))}
        </ScrollView>
      )}

      

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <BlurOverlay visible={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)} />

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this vehicle?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#ccc" }]} onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]} onPress={handleDelete}>
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddDriverModal}
        onRequestClose={() => setShowAddDriverModal(false)}
      >
        <BlurOverlay visible={showAddDriverModal} onRequestClose={() => setShowAddDriverModal(false)} />

        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Primary Driver</Text>
                <Picker
                  selectedValue={selectedPrimaryDriver}
                  onValueChange={(itemValue) => setSelectedPrimaryDriver(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Primary Driver" value="" />
                  {drivers.filter(driver => driver._id !== selectedSecondaryDriver).map((driver) => (
                    <Picker.Item key={driver._id} label={driver.name} value={driver._id} />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Secondary Driver</Text>
                <Picker
                  selectedValue={selectedSecondaryDriver}
                  onValueChange={(itemValue) => setSelectedSecondaryDriver(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Secondary Driver" value="" />
                  {drivers.filter(driver => driver._id !== selectedPrimaryDriver).map((driver) => (
                    <Picker.Item key={driver._id} label={driver.name} value={driver._id} />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cleaner</Text>
                <Picker
                  selectedValue={selectedCleaner}
                  onValueChange={(itemValue) => setSelectedCleaner(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Cleaner" value="" />
                  {cleaners.map((cleaner) => (
                    <Picker.Item key={cleaner._id} label={cleaner.name} value={cleaner._id} />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Instructions</Text>
                <TextInput
                  value={instruction}
                  style={[styles.input, styles.textarea, { height: Math.max(50, inputHeight) }]}
                  onChangeText={(text) => setInstruction(text)}
                  multiline={true}
                  onContentSizeChange={(event) => {
                    setInputHeight(event.nativeEvent.contentSize.height);
                  }}
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#ccc" }]} onPress={() => setShowAddDriverModal(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]} onPress={handleAddDriver}>
                  <Text style={[styles.modalButtonText, { color: "#fff" }]}>Add Driver</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    backgroundColor: "#EAEAEA",
  },
  circle: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#EEDC41',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  circleText: {
    color: '#000000',
    textAlign: 'center',
    fontSize:8,
    fontWeight:'900'
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    borderColor: Colors.secondary,
    borderWidth: 1
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: Colors.secondary,
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
  routesList: {
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal:8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
    alignItems: "center",
    gap: 5,
  },
  editButton: {
    backgroundColor: Colors.darkBlue,
    borderRadius: 5,
    padding: 5,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  cardText: {
    marginBottom: 1,
    color: '#000000',
    fontWeight: "600",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginHorizontal: 5,
    width: 100,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 15,
    width: "100%"
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 5,
  },
  input: {
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: 'center'
  },
  textarea: {
    minHeight: 50,
    maxHeight: 300,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
});

export default DailyRouteVehicles;