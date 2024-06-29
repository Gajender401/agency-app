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
import { Colors } from "@/constants/Colors"; // Replace with your colors constant
import { useGlobalContext } from "@/context/GlobalProvider"; // Ensure you have this hook or context

const AddRouteScreen: React.FC = () => {
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [departurePlace, setDeparturePlace] = useState("");
    const [destinationPlace, setDestinationPlace] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [loading, setLoading] = useState(false);
    const { apiCaller } = useGlobalContext(); // Ensure your global context provides an apiCaller

    const handleAddRoute = async () => {
        if (!vehicleNumber || !departurePlace || !destinationPlace || !departureTime) {
            Alert.alert("Please fill all fields.");
            return;
        }

        const newRoute = {
            vehicleId:vehicleNumber,
            departurePlace,
            destinationPlace,
            departureTime,
        };

        setLoading(true);
        try {
            await apiCaller.post('/api/dailyRoute', newRoute, { headers: { 'Content-Type': 'application/json' } });
            setLoading(false);
            resetForm();
            Alert.alert("Success", "Route added successfully!");
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to add route. Please try again.");
        }
    };

    const resetForm = () => {
        setVehicleNumber("");
        setDeparturePlace("");
        setDestinationPlace("");
        setDepartureTime("");
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
                        <Text style={styles.label}>Departure Place</Text>
                        <TextInput
                            style={styles.input}
                            value={departurePlace}
                            onChangeText={(text) => setDeparturePlace(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Destination Place</Text>
                        <TextInput
                            style={styles.input}
                            value={destinationPlace}
                            onChangeText={(text) => setDestinationPlace(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Departure Time</Text>
                        <TextInput
                            style={styles.input}
                            value={departureTime}
                            onChangeText={(text) => setDepartureTime(text)}
                        />
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleAddRoute}
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
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontSize: 13,
        color: Colors.secondary,
        fontWeight: "500"
    },
    input: {
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
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

export default AddRouteScreen;
