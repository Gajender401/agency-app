import React, { useState } from "react";
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
//@ts-ignore
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { useGlobalContext } from "@/context/GlobalProvider"; // Importing useGlobalContext

const AddBusScreen: React.FC = () => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [chassisBrand, setChassisBrand] = useState("");
  const [location, setLocation] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [selectedAC, setSelectedAC] = useState<string | null>(null);
  const [selectedForRent, setSelectedForRent] = useState<boolean>(false);
  const [selectedForSell, setSelectedForSell] = useState<boolean>(false);
  const [busImages, setBusImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { apiCaller } = useGlobalContext(); // Destructuring apiCaller from context

  const handleAddBus = async () => {
    if (!vehicleNo || !seatingCapacity || !vehicleModel || !bodyType || !chassisBrand || !location || !contactNo || busImages.length === 0) {
      Alert.alert("Please fill all fields and upload bus images.");
      return;
    }

    const newBus = {
      number: vehicleNo,
      seatingCapacity,
      model: vehicleModel,
      location,
      bodyType,
      chassisBrand,
      contactNumber: contactNo,
      isAC: selectedAC === "AC",
      isForRent: selectedForRent,
      isForSell: selectedForSell,
      photos: busImages,
      type: "BUS"
    };

    setLoading(true);
    try {
      await apiCaller.post('/api/vehicle', newBus, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLoading(false);
      resetForm();
      Alert.alert("Success", "Bus added successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert("Error", "Failed to add bus. Please try again.");
    }
  };

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setBusImages(result.assets.map(asset => asset.uri));
    }
  };

  const resetForm = () => {
    setVehicleNo("");
    setSeatingCapacity("");
    setVehicleModel("");
    setBodyType("");
    setChassisBrand("");
    setLocation("");
    setContactNo("");
    setSelectedAC(null);
    setSelectedForRent(false);
    setSelectedForSell(false);
    setBusImages([]);
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
          <Text style={styles.vehicleNumberLabel}>“If your vehicle is to be sold to other vehicle owners or is to be given on rent, then you will have to fill the option given below.”</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Seating Capacity</Text>
            <TextInput
              style={styles.input}
              value={seatingCapacity}
              onChangeText={(text) => setSeatingCapacity(text)}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Model</Text>
            <TextInput
              style={styles.input}
              value={vehicleModel}
              onChangeText={(text) => setVehicleModel(text)}
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

          <View style={styles.featuresContainer}>
            <RadioButtonGroup
              containerStyle={styles.radioButtonGroup}
              selected={selectedAC}
              onSelected={(value: string) => setSelectedAC(value)}
              radioBackground={Colors.darkBlue}
            >
              <RadioButtonItem value="AC" label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>AC</Text>} style={styles.radioButtonItem} />
              <RadioButtonItem value="NonAC" label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>Non-AC</Text>} style={styles.radioButtonItem} />
            </RadioButtonGroup>
          </View>

          <View style={styles.featuresContainer}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setSelectedForRent(!selectedForRent)}>
              <Text style={styles.checkboxLabel}>{selectedForRent ? "✔ " : ""}For Rent</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setSelectedForSell(!selectedForSell)}>
              <Text style={styles.checkboxLabel}>{selectedForSell ? "✔ " : ""}For Sell</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
            <Text style={styles.imagePickerText}>Upload Bus Images (Max 5)</Text>
          </TouchableOpacity>
          <View style={styles.imagePreviewContainer}>
            {busImages.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.previewImage} />
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
              onPress={handleAddBus}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Submit</Text>
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
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  radioButtonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },
  radioButtonItem: {
    borderColor: Colors.secondary,
    backgroundColor: "white",
    color: Colors.darkBlue,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
  },
  imagePicker: {
    padding: 15,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15,
  },
  imagePickerText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  modalButton: {
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  modalButtonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  vehicleNumberLabel: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default AddBusScreen;
