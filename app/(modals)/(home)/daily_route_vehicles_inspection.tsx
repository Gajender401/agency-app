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
  ActivityIndicator,
} from "react-native";
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalProvider";

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
  const [selectedRoute, setSelectedRoute] = useState<DailyRoute | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { apiCaller } = useGlobalContext();

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
        fetchDailyRoutes();
        setShowDeleteModal(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filterDailyRoutes = (routes: DailyRoute[], query: string) => {
    return routes.filter((route) =>
      Object.values(route).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const filteredRoutes = filterDailyRoutes(dailyRoutes, searchQuery);

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

      {loading ? (
        <ActivityIndicator size="large" color={Colors.darkBlue} />
      ) : (
        <ScrollView style={styles.routesList}>
          {filteredRoutes.map((route) => (
            <View key={route._id} style={styles.card}>
              <View style={styles.cardHeader}>
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
});

export default DailyRouteVehicles;