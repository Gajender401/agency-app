import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    SafeAreaView,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from "@/constants/Colors"; // Replace with your colors constant
import { useGlobalContext } from "@/context/GlobalProvider"; // Ensure you have this hook or context
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { router } from "expo-router";


const AddRouteScreen: React.FC = () => {
    const [vehicleNumber, setVehicleNumber] = useState<string>("");
    const [departurePlace, setDeparturePlace] = useState<string>("");
    const [destinationPlace, setDestinationPlace] = useState<string>("");
    const [departureTime, setDepartureTime] = useState<Date | undefined>(undefined);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
    const [vehicleNumbers, setVehicleNumbers] = useState<{ id: string, number: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { apiCaller, setRefresh, editData } = useGlobalContext();

    const findVehicleByNumber = (number: string) => {
        return vehicleNumbers.find(vehicle => vehicle.number === number);
    };

    const extractNumbers = (data: Vehicle[]): { id: string, number: string }[] => {
        return data.map(vehicle => ({ id: vehicle._id, number: vehicle.number }));
    };

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await apiCaller.get('/api/vehicle');
            setVehicleNumbers(extractNumbers(response.data.data.vehicles));
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    useEffect(() => {
        if (editData) {
            setVehicleNumber(editData.vehicle.number);
            setDeparturePlace(editData.departurePlace);
            setDestinationPlace(editData.destinationPlace);
            setDepartureTime(new Date(editData.departureTime));
        }
    }, [])

    const handleAddRoute = async () => {
        if (!vehicleNumber || !departurePlace || !destinationPlace || !departureTime) {
            Alert.alert("Please fill all required fields.");
            return;
        }

        console.log(departureTime);

        const newRoute = {
            vehicleId: findVehicleByNumber(vehicleNumber)?.id ? findVehicleByNumber(vehicleNumber)?.id : vehicleNumber,
            departurePlace,
            destinationPlace,
            departureTime: departureTime,
        };

        setLoading(true);
        try {
            await apiCaller.patch(`/api/dailyRoute?routeId=${editData._id}`, newRoute, { headers: { 'Content-Type': 'application/json' } });
            setLoading(false);
            setRefresh(prev => !prev)
            resetForm();
            Alert.alert("Success", "Route updated successfully!");
            router.back()
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to update route. Please try again.");
        }
    };

    const resetForm = () => {
        setVehicleNumber("");
        setDeparturePlace("");
        setDestinationPlace("");
        setDepartureTime(undefined);
    };

    const onChangeTime = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setDepartureTime(selectedTime);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Vehicle Number</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={vehicleNumber}
                                    onValueChange={(itemValue) => setVehicleNumber(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label={vehicleNumber} value={findVehicleByNumber(vehicleNumber)?.id} />
                                    {vehicleNumbers.map((number, index) => (
                                        <Picker.Item key={index} label={number.number} value={number.id} />
                                    ))}
                                </Picker>
                            </View>
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
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Text>{departureTime ? departureTime.toLocaleTimeString() : "Select Time"}</Text>
                            </TouchableOpacity>
                            {showTimePicker && (
                                <DateTimePicker
                                    value={departureTime || new Date()}
                                    mode="time"
                                    display="default"
                                    onChange={onChangeTime}
                                    is24Hour={false}
                                />
                            )}
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
        </GestureHandlerRootView>
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
        justifyContent: 'center'
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    pickerContainer: {
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    picker: {
        height: 40,
        width: '100%',
        marginTop: -6,
        marginBottom: 6
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