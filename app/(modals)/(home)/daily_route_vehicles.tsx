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

interface DailyRoute {
  _id: string;
  vehicleNumber: string;
  departurePlace: string;
  destinationPlace: string;
  primaryDriver: string;
  secondaryDriver: string;
  cleaner: string;
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

  useEffect(() => {
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

    fetchDailyRoutes();
  }, []);

  const handleDelete = async () => {
    if (selectedRoute) {
      try {
        await apiCaller.delete(`/api/dailyRoute/${selectedRoute._id}`);
        setDailyRoutes(dailyRoutes.filter(route => route._id !== selectedRoute._id));
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
                Cleaner Name: <Text style={{ color: "black" }}>{route.cleaner}</Text>
              </Text>
              <Text style={styles.cardText}>
                Primary Driver : <Text style={{ color: "black" }}>{route.primaryDriver}</Text>
              </Text>
              <Text style={styles.cardText}>
                Secondary Driver: <Text style={{ color: "black" }}>{route.secondaryDriver}</Text>
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

        <TouchableWithoutFeedback onPress={() => setShowDeleteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Are you sure you want to delete this route?</Text>
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
          </View>
        </TouchableWithoutFeedback>
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
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ScrollView style={styles.modalScroll}>
                <View style={styles.modalContent}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Driver Name</Text>
                    <TextInput
                      style={styles.input}
                      value={driverName}
                      onChangeText={(text) => setDriverName(text)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Driver Name 2</Text>
                    <TextInput
                      style={styles.input}
                      value={driverName2}
                      onChangeText={(text) => setDriverName2(text)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Cleaner Name</Text>
                    <TextInput
                      style={styles.input}
                      value={cleanerName}
                      onChangeText={(text) => setCleanerName(text)}
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
              </ScrollView>
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
    padding: 16,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    borderColor:Colors.secondary,
    borderWidth:1
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: Colors.darkBlue,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    width:120
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  routesList: {
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 8,
    gap:10
  },
  editButton: {
    backgroundColor: Colors.darkBlue,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  editButtonText: {
    color: "#fff",
  },
  cardText: {
    marginBottom: 4,
    color:Colors.secondary,
    fontSize:14,
    fontWeight:"500"
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    width: "80%",
    elevation: 4,
  },
  modalContent: {
    alignItems: "center",
  },
  modalText: {
    marginBottom: 16,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
  },
  modalButtonText: {
    fontWeight: "bold",
  },
  modalScroll: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
    width:"100%"
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default DailyRouteVehicles;
