import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Picker } from '@react-native-picker/picker';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${month}/${day}/${year}`;
}

const PackageVehicleListScreen: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const { apiCaller, setInvoiceData, refresh, setPhotos } = useGlobalContext();

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get('/api/packageBooking');
      const filteredRoutes = response.data.data.filter((route: Package) => route.status !== "COMPLETED");
      setPackages(filteredRoutes);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [refresh]);

  useEffect(() => {
    filterPackages();
  }, [packages, searchQuery, selectedVehicleType]);

  const filterPackages = () => {
    let filtered = packages;

    if (searchQuery) {
      filtered = filtered.filter(pkg => 
        pkg.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.departurePlace.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destinationPlace.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.vehicle && pkg.vehicle.number.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedVehicleType) {
      filtered = filtered.filter(pkg => pkg.vehicle && pkg.vehicle.type === selectedVehicleType);
    }

    setFilteredPackages(filtered);
  };

  const handleDelete = async () => {
    if (selectedPackage) {
      try {
        await apiCaller.delete(`/api/packageBooking?bookingId=${selectedPackage._id}`);
        fetchPackages();
        setShowDeleteModal(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleShowDetails = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowDetailsModal(true);
  };

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
{/* 
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedVehicleType}
          onValueChange={(itemValue) => setSelectedVehicleType(itemValue)}
          style={styles.filterPicker}
        >
          <Picker.Item label="All Vehicle Types" value="" />
          <Picker.Item label="CAR" value="CAR" />
          <Picker.Item label="BUS" value="BUS" />
          <Picker.Item label="TRUCK" value="TRUCK" />
          <Picker.Item label="TAMPO" value="TAMPO" />
        </Picker>
      </View> */}


      {loading ? (
        <ActivityIndicator size="large" color={Colors.darkBlue} />
      ) : (
        <ScrollView style={styles.packagesList}>
          {filteredPackages.map((pkg) => (
            <View key={pkg._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <TouchableOpacity onPress={() => handleShowDetails(pkg)} style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setInvoiceData(pkg); router.push("invoice") }} style={styles.editButton}>
                  <Text style={styles.editButtonText}>View Invoice</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowDeleteModal(true); setSelectedPackage(pkg); }}>
                  <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                </TouchableOpacity>
              </View>

              <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }} >
                <Text style={{ fontWeight: "bold", fontSize: 14 }} >Departure</Text>
                <Text style={{ fontWeight: "bold", fontSize: 14 }} >Destination</Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-around", marginVertical: 5 }} >
                <Text style={{ fontWeight: "bold", fontSize: 16 }} >{pkg.departurePlace}</Text>
                <MaterialIcons name="keyboard-double-arrow-right" size={24} color={Colors.darkBlue} />
                <Text style={{ fontWeight: "bold", fontSize: 16 }} >{pkg.destinationPlace}</Text>
              </View>

              <Text style={styles.cardText}>Customer Name: <Text style={styles.textValue}>{pkg.customerName}</Text></Text>
              <Text style={styles.cardText}>Journey Duration: <Text style={styles.textValue}>{formatDate(pkg.departureTime)} to {formatDate(pkg.returnTime)}</Text></Text>
              {pkg.vehicle &&
                <Text style={styles.cardText}>Vehicle Number: <Text style={styles.textValue}>{pkg.vehicle.number}</Text></Text>
              }
              {pkg.otherVehicle._id &&
                <Text style={styles.cardText}>Other Vehicle: <Text style={styles.textValue}>{pkg.otherVehicle.number}</Text></Text>
              }

              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => router.push(`/package_vehicle_booking_more/${pkg._id}`)}
              >
                <Text style={styles.viewMoreButtonText}>View More</Text>
              </TouchableOpacity>
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this package?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                onPress={handleDelete}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDetailsModal}
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Journey Details</Text>
            <Text style={styles.modalText}>Before Journey Notes: {selectedPackage?.beforeJourneyNote || ''}</Text>
            <Text style={styles.modalText}>After Journey Notes: {selectedPackage?.afterJourneyNote || ''}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                onPress={() => {setPhotos(selectedPackage?.beforeJourneyPhotos); router.push('before_photos')} }
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Before Journey Photos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                onPress={() => {setPhotos(selectedPackage?.afterJourneyPhotos); router.push('after_photos')} }
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>After Journey Photos</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ccc", marginTop: 10 }]}
              onPress={() => setShowDetailsModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

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
  packagesList: {
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
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 5,
    height: 25,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "semibold",
    fontSize: 10,
  },
  cardText: {
    marginBottom: 6,
    color: Colors.secondary,
    fontWeight: "500",
    fontSize: 12,
  },
  textValue: {
    color: "black",
  },
  viewMoreButton: {
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 5,
    alignItems: "center",
    marginTop: 10,
  },
  viewMoreButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
  filterContainer: {
    marginBottom: 10,
    marginTop:-10
  },
  filterPicker: {
    height: 40,
    width: '100%',
    borderRadius: 5,
    marginBottom:10
  },
  detailsButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 5,
    height: 25,
    marginRight: 5,
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "semibold",
    fontSize: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

export default PackageVehicleListScreen;