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
} from "react-native";
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

interface Driver {
  _id: string;
  name: string;
  mobileNumber: string;
  photo: string;
}

interface Cleaner {
  _id: string;
  name: string;
  mobileNumber: string;
  photo: string;
}

interface DailyRoute {
  _id: string;
  vehicleNumber: string;
  departurePlace: string;
  destinationPlace: string;
  primaryDriver: Driver | null;
  secondaryDriver: Driver | null;
  cleaner: Cleaner | null;
  departureTime: string;
  instructions: string;
}

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

const DailyRouteVehicles: React.FC = () => {
  const [dailyRoutes, setDailyRoutes] = useState<DailyRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<DailyRoute | null>(null);
  const [driverName, setDriverName] = useState("");
  const [driverName2, setDriverName2] = useState("");
  const [cleanerName, setCleanerName] = useState("");
  const { apiCaller, token } = useGlobalContext();

  const fetchDailyRoutes = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get('/api/dailyRoute');
      setDailyRoutes(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyRoutes();
  }, []);

  const handleDelete = async () => {
    if (selectedRoute) {
      try {
        await apiCaller.delete(`/api/dailyRoute?dailyRouteId=${selectedRoute._id}`);
        fetchDailyRoutes()
        setShowDeleteModal(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddDriver = () => {
    if (!driverName || !driverName2 || !cleanerName) {
      Alert.alert("Please fill all fields.");
      return;
    }

    const newDriverData = {
      driverName,
      driverName2,
      cleanerName,
    };

    console.log("New Driver Data:", newDriverData);

    // Simulate loading state (you can replace this with actual API call)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      resetForm();
      Alert.alert("Success", "Driver added successfully!");
    }, 1500);
  };

  const resetForm = () => {
    setDriverName("");
    setDriverName2("");
    setCleanerName("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={18} color={Colors.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={Colors.secondary}
        />
      </View>

      <TouchableOpacity onPress={() => router.push("add_daily_route_vehicles")} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Route</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.darkBlue} />
      ) : (
        <ScrollView style={styles.routesList}>
          {dailyRoutes.map((route, index) => (
            <View key={route._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <TouchableOpacity style={styles.editButton} onPress={() => setShowAddDriverModal(true)}>
                  <Text style={styles.editButtonText}>Add Driver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit Route</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowDeleteModal(true); setSelectedRoute(route); }}>
                  <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                </TouchableOpacity>
              </View>

              <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }} >
                <Text style={{ fontWeight: "bold", fontSize: 15 }} >Departure</Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }} >Destination</Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-around", marginVertical: 5 }} >
                <Text style={{ fontWeight: "bold", fontSize: 18 }} >{route.departurePlace}</Text>
                <MaterialIcons name="keyboard-double-arrow-right" size={24} color={Colors.darkBlue} />
                <Text style={{ fontWeight: "bold", fontSize: 18 }} >{route.destinationPlace}</Text>
              </View>

              <Text style={styles.cardText}>
                Vehicle Number: <Text style={{ color: "black" }}>{route.vehicleNumber}</Text>
              </Text>
              <Text style={styles.cardText}>
                Departure Time: <Text style={{ color: "black" }}>{route.departureTime}</Text>
              </Text>
              <Text style={styles.cardText}>
                Cleaner Name: <Text style={{ color: "black" }}>{route.cleaner ? route.cleaner.name : "N/A"}</Text>
              </Text>
              <Text style={styles.cardText}>
                Primary Driver : <Text style={{ color: "black" }}>{route.primaryDriver ? route.primaryDriver.name : "N/A"}</Text>
              </Text>
              <Text style={styles.cardText}>
                Secondary Driver: <Text style={{ color: "black" }}>{route.secondaryDriver ? route.secondaryDriver.name : "N/A"}</Text>
              </Text>

            </View>
          ))}
        </ScrollView>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <BlurOverlay visible={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)} />

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this car?</Text>
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

      {/* Add Driver Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddDriverModal}
        onRequestClose={() => setShowAddDriverModal(false)}
      >
        <BlurOverlay visible={showAddDriverModal} onRequestClose={() => setShowAddDriverModal(false)} />

        <TouchableWithoutFeedback onPress={() => setShowAddDriverModal(false)}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Driver Name</Text>
                    <TextInput
                      style={styles.input}
                      value={driverName}
                      onChangeText={setDriverName}
                      placeholder="Driver Name"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Driver Name 2</Text>
                    <TextInput
                      style={styles.input}
                      value={driverName2}
                      onChangeText={setDriverName2}
                      placeholder="Driver Name 2"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Cleaner Name</Text>
                    <TextInput
                      style={styles.input}
                      value={cleanerName}
                      onChangeText={setCleanerName}
                      placeholder="Cleaner Name"
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
            </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
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
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
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
    marginBottom: 6,
    color: Colors.secondary,
    fontWeight: "500",
  },
  // Modal Styles
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalScroll: {
    width: "100%",
  },
  // Photo Modal Styles
  photoModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photoModalOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  photoModalContent: {
    width: "80%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
    marginVertical: 100
  },
  photoModalContentContainer: {
    alignItems: "center",
  },
  fullImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
    resizeMode: "contain",
  },

  inputGroup: {
    marginBottom: 15,
    width:"100%"
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
  },
});

export default DailyRouteVehicles;
