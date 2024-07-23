import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";

const AddTruckScreen: React.FC = () => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [location, setLocation] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [chassisBrand, setChassisBrand] = useState("");
  const [noOfTyres, setNoOfTyres] = useState("");
  const [vehicleWeightInKGS, setVehicleWeightInKGS] = useState("");
  const [selectedForRent, setSelectedForRent] = useState<boolean>(false);
  const [selectedForSell, setSelectedForSell] = useState<boolean>(false);
  const [truckImages, setTruckImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { apiCaller, editData, setRefresh } = useGlobalContext();

  useEffect(() => {
      if (editData) {
          setVehicleNo(editData.number);
          setSeatingCapacity(editData.seatingCapacity);
          setVehicleModel(editData.model);
          setLocation(editData.location);
          setContactNo(editData.contactNumber);
          setBodyType(editData.bodyType);
          setChassisBrand(editData.chassisBrand);
          setSelectedForRent(editData.isForRent);
          setSelectedForSell(editData.isForSell);
          setTruckImages(editData.photos);
      }
  }, [editData])

  const handleAddTruck = async () => {
    if (!vehicleNo || !seatingCapacity || !vehicleModel || !location || !contactNo || !noOfTyres || !vehicleWeightInKGS || truckImages.length === 0) {
      Alert.alert("Please fill all fields and upload truck images.");
      return;
    }

    const newTruck = {
      number: vehicleNo,
      seatingCapacity,
      model: vehicleModel,
      location,
      bodyType,
      chassisBrand,
      contactNumber: contactNo,
      noOfTyres,
      vehicleWeightInKGS,
      isAC: false,
      isForRent: selectedForRent,
      isForSell: selectedForSell,
      photos: truckImages,
      type: "TRUCK"
    };

    setLoading(true);
    try {
      await apiCaller.patch(`/api/vehicle?vehicleId=${editData._id}`, newTruck, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLoading(false);
      setRefresh(prev=>!prev)
      resetForm();
      Alert.alert("Success", "Truck updated successfully!");
      router.back()
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert("Error", "Failed to update truck. Please try again.");
    }
  };

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setTruckImages(result.assets.map(asset => asset.uri));
    }
  };

  const resetForm = () => {
    setVehicleNo("");
    setSeatingCapacity("");
    setVehicleModel("");
    setLocation("");
    setContactNo("");
    setBodyType("");
    setChassisBrand("");
    setNoOfTyres("");
    setVehicleWeightInKGS("");
    setSelectedForRent(false);
    setSelectedForSell(false);
    setTruckImages([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle No</Text>
            <TextInput
              style={styles.input}
              value={vehicleNo}
              onChangeText={(text) => setVehicleNo(text)}
            />
          </View>
          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>Seating Capacity</Text>
            <TextInput
              style={styles.input}
              value={seatingCapacity}
              onChangeText={(text) => setSeatingCapacity(text)}
              keyboardType="numeric"
            />
          </View> */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Model</Text>
            <TextInput
              style={styles.input}
              value={vehicleModel}
              onChangeText={(text) => setVehicleModel(text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={(text) => setLocation(text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact No</Text>
            <TextInput
              style={styles.input}
              value={contactNo}
              onChangeText={(text) => setContactNo(text)}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Body Type</Text>
            <TextInput
              style={styles.input}
              value={bodyType}
              onChangeText={(text) => setBodyType(text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chassis Number</Text>
            <TextInput
              style={styles.input}
              value={chassisBrand}
              onChangeText={(text) => setChassisBrand(text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>No of Tyres</Text>
            <TextInput
              style={styles.input}
              value={noOfTyres}
              onChangeText={(text) => setNoOfTyres(text)}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Weight in Tons</Text>
            <TextInput
              style={styles.input}
              value={vehicleWeightInKGS}
              onChangeText={(text) => setVehicleWeightInKGS(text)}
              keyboardType="numeric"
            />
          </View>

          {/* For Rent/For Sell Checkboxes */}
          <View style={styles.featuresContainer}>
            <TouchableOpacity
              style={[styles.checkboxContainer, { backgroundColor: selectedForRent ? Colors.darkBlue : Colors.secondary }]}
              onPress={() => setSelectedForRent(!selectedForRent)}
            >
              <Text style={styles.checkboxText}>For Rent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.checkboxContainer, { backgroundColor: selectedForSell ? Colors.darkBlue : Colors.secondary }]}
              onPress={() => setSelectedForSell(!selectedForSell)}
            >
              <Text style={styles.checkboxText}>For Sell</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
            <Text style={styles.imagePickerText}>Upload Truck Images (Max 5)</Text>
          </TouchableOpacity>
          <View style={styles.imagePreviewContainer}>
            {truckImages.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.previewImage} />
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
              onPress={handleAddTruck}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Update</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  modalContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 13,
    color: Colors.secondary,
    fontWeight: "500",
  },
  input: {
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  checkboxContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  checkboxText: {
    marginLeft: 5,
    color: "#fff",
    fontWeight: "500",
  },
  imagePicker: {
    backgroundColor: Colors.secondary,
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  imagePickerText: {
    color: "#fff",
    fontWeight: "500",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
  },
  modalButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40
  },
  modalButtonText: {
    fontWeight: "bold",
  },
});

export default AddTruckScreen;
