import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    SafeAreaView,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    Image
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";

const AddVehicleDocumentsScreen: React.FC = () => {
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [rcImage, setRcImage] = useState<string | null>(null);
    const [insuranceImage, setInsuranceImage] = useState<string | null>(null);
    const [permitImage, setPermitImage] = useState<string | null>(null);
    const [fitnessImage, setFitnessImage] = useState<string | null>(null);
    const [taxImage, setTaxImage] = useState<string | null>(null);
    const [pucImage, setPucImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAddVehicleDocuments = () => {
        if (!vehicleNumber || !rcImage || !insuranceImage || !permitImage || !fitnessImage || !taxImage || !pucImage) {
            Alert.alert("Please fill all fields and upload all documents.");
            return;
        }

        const newVehicleDocuments = {
            vehicleNumber,
            rcImage,
            insuranceImage,
            permitImage,
            fitnessImage,
            taxImage,
            pucImage,
        };

        console.log("New Vehicle Documents Data:", newVehicleDocuments);

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            resetForm();
            Alert.alert("Success", "Vehicle documents added successfully!");
        }, 1500);
    };

    const handleImagePicker = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const resetForm = () => {
        setVehicleNumber("");
        setRcImage(null);
        setInsuranceImage(null);
        setPermitImage(null);
        setFitnessImage(null);
        setTaxImage(null);
        setPucImage(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Vehicle Number</Text>
                        <TextInput
                            style={styles.input}
                            value={vehicleNumber}
                            onChangeText={(text) => setVehicleNumber(text)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={() => handleImagePicker(setRcImage)}
                        >
                            <Text style={styles.imagePickerText}>Upload RC</Text>
                        </TouchableOpacity>
                        {rcImage && <Image source={{ uri: rcImage }} style={styles.previewImage} />}
                    </View>

                    <View style={styles.inputGroup}>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={() => handleImagePicker(setInsuranceImage)}
                        >
                            <Text style={styles.imagePickerText}>Upload Insurance</Text>
                        </TouchableOpacity>
                        {insuranceImage && <Image source={{ uri: insuranceImage }} style={styles.previewImage} />}
                    </View>

                    <View style={styles.inputGroup}>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={() => handleImagePicker(setPermitImage)}
                        >
                            <Text style={styles.imagePickerText}>Upload Permit</Text>
                        </TouchableOpacity>
                        {permitImage && <Image source={{ uri: permitImage }} style={styles.previewImage} />}
                    </View>

                    <View style={styles.inputGroup}>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={() => handleImagePicker(setFitnessImage)}
                        >
                            <Text style={styles.imagePickerText}>Upload Fitness</Text>
                        </TouchableOpacity>
                        {fitnessImage && <Image source={{ uri: fitnessImage }} style={styles.previewImage} />}
                    </View>

                    <View style={styles.inputGroup}>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={() => handleImagePicker(setTaxImage)}
                        >
                            <Text style={styles.imagePickerText}>Upload Tax</Text>
                        </TouchableOpacity>
                        {taxImage && <Image source={{ uri: taxImage }} style={styles.previewImage} />}
                    </View>

                    <View style={styles.inputGroup}>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={() => handleImagePicker(setPucImage)}
                        >
                            <Text style={styles.imagePickerText}>Upload PUC</Text>
                        </TouchableOpacity>
                        {pucImage && <Image source={{ uri: pucImage }} style={styles.previewImage} />}
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleAddVehicleDocuments}
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
    imagePicker: {
        backgroundColor: Colors.darkBlue,
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 15,
    },
    imagePickerText: {
        color: "#fff",
        fontWeight: "bold",
    },
    previewImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
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

export default AddVehicleDocumentsScreen;
