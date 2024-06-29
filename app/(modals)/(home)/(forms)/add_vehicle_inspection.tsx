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

const AddVehicleInspectionScreen: React.FC = () => {
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [inspectionDate, setInspectionDate] = useState("");
    const [inspectorName, setInspectorName] = useState("");
    const [comments, setComments] = useState("");
    const [billImage, setBillImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAddInspection = () => {
        if (!vehicleNumber || !inspectionDate || !inspectorName || !billImage) {
            Alert.alert("Please fill all fields and upload the bill image.");
            return;
        }

        const newInspection = {
            vehicleNumber,
            inspectionDate,
            inspectorName,
            comments,
            billImage,
        };

        console.log("New Inspection Data:", newInspection);

        // Simulate loading state (you can replace this with actual API call)
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            resetForm();
            Alert.alert("Success", "Inspection added successfully!");
        }, 1500);
    };

    const handleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setBillImage(result.assets[0].uri);
        }
    };

    const resetForm = () => {
        setVehicleNumber("");
        setInspectionDate("");
        setInspectorName("");
        setComments("");
        setBillImage(null);
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
                        <Text style={styles.label}>Inspection Date</Text>
                        <TextInput
                            style={styles.input}
                            value={inspectionDate}
                            onChangeText={(text) => setInspectionDate(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Inspector Name</Text>
                        <TextInput
                            style={styles.input}
                            value={inspectorName}
                            onChangeText={(text) => setInspectorName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Comments</Text>
                        <TextInput
                            style={styles.input}
                            value={comments}
                            onChangeText={(text) => setComments(text)}
                        />
                    </View>

                    <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
                        <Text style={styles.imagePickerText}>Upload Bill Image</Text>
                    </TouchableOpacity>
                    {billImage && (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: billImage }} style={styles.previewImage} />
                        </View>
                    )}

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleAddInspection}
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
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
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
    imagePreviewContainer: {
        alignItems: "center",
        marginBottom: 15,
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
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
        marginBottom: 40
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddVehicleInspectionScreen;
