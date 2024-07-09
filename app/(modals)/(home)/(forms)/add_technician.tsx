import React, { useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    TextInput,
    SafeAreaView,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors"; // Replace with your colors constant
import { useGlobalContext } from "@/context/GlobalProvider"; // Ensure you have this hook or context

const AddTechnicianScreen: React.FC = () => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [alternateNumber, setAlternateNumber] = useState("");
    const [technicianType, setTechnicianType] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [loading, setLoading] = useState(false);
    const { apiCaller } = useGlobalContext(); // Ensure your global context provides an apiCaller

    const handleAddTechnician = async () => {
        if (!name || !mobile || !alternateNumber || !technicianType || !vehicleType) {
            Alert.alert("Please fill all fields.");
            return;
        }

        const newTechnician = {
            name,
            mobileNumber: mobile,
            alternateNumber,
            technicianType,
            vehicleType,
        };

        setLoading(true);
        try {
            await apiCaller.post('/api/technician', newTechnician, { headers: { 'Content-Type': 'application/json' } });
            setLoading(false);
            resetForm();
            Alert.alert("Success", "Technician added successfully!");
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to add technician. Please try again.");
        }
    };

    const resetForm = () => {
        setName("");
        setMobile("");
        setAlternateNumber("");
        setTechnicianType("");
        setVehicleType("");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Technician Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mobile Number</Text>
                        <TextInput
                            style={styles.input}
                            value={mobile}
                            onChangeText={(text) => setMobile(text)}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Alternate Number</Text>
                        <TextInput
                            style={styles.input}
                            value={alternateNumber}
                            onChangeText={(text) => setAlternateNumber(text)}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Technician Type</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={technicianType}
                                onValueChange={(itemValue) => setTechnicianType(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item style={{ color: Colors.secondary }} label="Select Technician Type" value="" />
                                <Picker.Item label="MECHANIC" value="MECHANIC" />
                                <Picker.Item label="ELECTRICIAN" value="ELECTRICIAN" />
                                <Picker.Item label="SPARE PART SHOP" value="SPAREPARTSHOP" />
                                <Picker.Item label="SPRING WORK" value="SPRINGWORK" />
                                <Picker.Item label="BATTERY SERVICES" value="BATTERYSERVICES" />
                                <Picker.Item label="VEHICLE BODY REPAIR" value="VEHICLEBODYREPAIR" />
                                <Picker.Item label="CRANE SERVICE" value="CRANESERVICES" />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Vehicle Type</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={vehicleType}
                                onValueChange={(itemValue) => setVehicleType(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item style={{ color: Colors.secondary }} label="Select Vehicle Type" value="" />
                                <Picker.Item label="CAR" value="CAR" />
                                <Picker.Item label="TRUCK" value="TRUCK" />
                                <Picker.Item label="BUS" value="BUS" />
                                <Picker.Item label="TEMPO" value="TAMPO" />
                                <Picker.Item label="ALL" value="ALL" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleAddTechnician}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.buttonText, { color: "#fff" }]}>Submit</Text>
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
        backgroundColor: "#ffffff",
    },
    scrollView: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
        paddingHorizontal: 20,
    },
    content: {
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 5,
        padding: 20,
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
    pickerContainer: {
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        overflow: "hidden",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10,
        marginBottom: 40
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    picker: {
        width: "100%",
        marginVertical: -6,
    },
});

export default AddTechnicianScreen;
