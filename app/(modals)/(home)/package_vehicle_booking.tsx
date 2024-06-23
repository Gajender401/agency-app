import React from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { packageData } from "@/constants/dummy";

const PackageVehicleListScreen: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleDelete = () => {
    // Implement delete logic here
    console.log("Deleting package...");
    setShowDeleteModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={18} color={Colors.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={Colors.secondary}
        />
      </View>

      {/* Add Package Button */}
      <TouchableOpacity onPress={() => router.push("add_package_vehicle_booking")} style={styles.addButton}>
        <Text style={styles.addButtonText}>Create Customer Invoice</Text>
      </TouchableOpacity>

      {/* Package List */}
      <ScrollView style={styles.packagesList}>
        {packageData.map((pkg, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>View Invoice</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Add Driver</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
                <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
              </TouchableOpacity>
            </View>

            <View style={{width:"100%", flexDirection:"row", justifyContent:"space-between"}} >
              <Text style={{fontWeight:"semibold", fontSize:14}} >Departure</Text>
              <Text style={{fontWeight:"semibold", fontSize:14}} >Destination</Text>
            </View>
            <View style={{width:"100%", flexDirection:"row", justifyContent:"space-around", marginVertical:5}} >
              <Text style={{fontWeight:"semibold", fontSize:15}} >{pkg.departurePlace}</Text>
              <MaterialIcons name="keyboard-double-arrow-right" size={24} color={Colors.darkBlue} />
              <Text style={{fontWeight:"semibold", fontSize:15}} >{pkg.destinationPlace}</Text>
            </View>

            {/* Updated cardText section */}
            <Text style={styles.cardText}>Customer Name: <Text style={{color:"black"}}> {pkg.customerName}</Text></Text>
            <Text style={styles.cardText}>Journey Duration: <Text style={{color:"black"}}> {pkg.departureTime} to {pkg.returnTime}</Text></Text>
            <Text style={styles.cardText}>Vehicle Number: <Text style={{color:"black"}}> {pkg.vehicleNumber}</Text></Text>
            <Text style={styles.cardText}>Other Vehicle: <Text style={{color:"black"}}> {pkg.otherVehicleNumber}</Text></Text>

            {/* View More Button */}
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => router.push("package_vehicle_booking_more")}
            >
              <Text style={styles.viewMoreButtonText}>View More</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        {/* Blur Overlay */}
        {/* Implement BlurOverlay component */}

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerButton: {
    backgroundColor: Colors.darkBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  headerButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
  addButton: {
    backgroundColor: Colors.darkBlue,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
    width: 150,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "semibold",
    fontSize:12,
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
    alignItems:"center",
    gap:5
  },
  editButton: {
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 5,
    height:25
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "semibold",
    fontSize:10
  },
  cardText: {
    marginBottom: 6,
    color: Colors.secondary,
    fontWeight: "500",
    fontSize: 12,
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    minWidth: 300,
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PackageVehicleListScreen;
