import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";

const AddServiceHistoryScreen: React.FC = () => {
    const [garageName, setGarageName] = useState("");
    const [garageNumber, setGarageNumber] = useState("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [workDescription, setWorkDescription] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [billImage, setBillImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [vehicleNumbers, setVehicleNumbers] = useState<{ id: string, number: string }[]>([]);
    const { apiCaller } = useGlobalContext();

    const extractNumbers = (data: Vehicle[]): { id: string, number: string }[] => {
        return data.map(vehicle => ({ id: vehicle._id, number: vehicle.number }));
    };

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await apiCaller.get('/api/vehicle');
            setVehicleNumbers(extractNumbers(response.data.data));
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleAddServiceHistory = async () => {
        if (!garageName || !garageNumber || !date || !workDescription || !vehicleNumber || !billImage) {
            Alert.alert("Please fill all fields and provide the bill image.");
            return;
        }

        const newServiceHistory = {
            garageName,
            garageNumber,
            date: date.toISOString().split('T')[0],
            workDescription,
            vehicleNumeber:vehicleNumber,
            bill: billImage,
        };

        console.log(newServiceHistory);
        

        setLoading(true);
        try {
            await apiCaller.post('/api/service', newServiceHistory, { headers: { 'Content-Type': 'multipart/form-data' } });
            setLoading(false);
            resetForm();
            Alert.alert("Success", "Service history added successfully!");
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to add service history. Please try again.");
        }
    };

    const handleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setBillImage(result.assets[0].uri);
        }
    };

    const resetForm = () => {
        setGarageName("");
        setGarageNumber("");
        setDate(undefined);
        setWorkDescription("");
        setVehicleNumber("");
        setBillImage(null);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }} >
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
                                    <Picker.Item label="Select Vehicle Number" value="" />
                                    {vehicleNumbers.map((number, index) => (
                                        <Picker.Item key={index} label={number.number} value={number.number} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Garage Name</Text>
                            <TextInput
                                style={styles.input}
                                value={garageName}
                                onChangeText={(text) => setGarageName(text)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Garage Number</Text>
                            <TextInput
                                style={styles.input}
                                value={garageNumber}
                                onChangeText={(text) => setGarageNumber(text)}
                                keyboardType="phone-pad"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Date</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text>{date ? date.toDateString() : "Select Date"}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDate}
                                />
                            )}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Work Description</Text>
                            <TextInput
                                style={styles.input}
                                value={workDescription}
                                onChangeText={(text) => setWorkDescription(text)}
                            />
                        </View>
                        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
                            <Text style={styles.imagePickerText}>Select Bill Image</Text>
                        </TouchableOpacity>
                        {billImage && <Image source={{ uri: billImage }} style={styles.previewImage} />}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                                onPress={handleAddServiceHistory}
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
        marginBottom: 15,
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
});

export default AddServiceHistoryScreen;