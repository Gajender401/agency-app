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
    ActivityIndicator,
    Image
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from "@/constants/Colors"; // Replace with your colors constant
import { useGlobalContext } from "@/context/GlobalProvider"; // Ensure you have this hook or context
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";


const AddRouteScreen: React.FC = () => {
    const [busImages, setBusImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [vehicleNumber, setVehicleNumber] = useState<string>("");
    const [departurePlace, setDeparturePlace] = useState<string>("");
    const [destinationPlace, setDestinationPlace] = useState<string>("");
    const [departureTime, setDepartureTime] = useState<Date | undefined>(undefined);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
    const [vehicleNumbers, setVehicleNumbers] = useState<{ id: string, number: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { apiCaller, setRefresh } = useGlobalContext();
    const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
    const [selectedOption, setSelectedOption] = useState(null);


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

    const handleAddRoute = async () => {
        if (!vehicleNumber || !departurePlace || !destinationPlace || !departureTime) {
            Alert.alert("Please fill all required fields.");
            return;
        }

        const newRoute = {
            vehicleId: vehicleNumber,
            departurePlace,
            destinationPlace,
            departureTime: departureTime.toISOString(),
        };

        setLoading(true);
        try {
            await apiCaller.post('/api/dailyRoute', newRoute, { headers: { 'Content-Type': 'application/json' } });
            setLoading(false);
            setRefresh(prev=>!prev)
            resetForm();
            Alert.alert("Success", "Route added successfully!");
            router.back()
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to add route. Please try again.");
        }
    };
    
    const handleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: 1,
        });
      
        if (!result.canceled && result.assets) {
          setBusImages(result.assets);
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
    
    const toggleSelectAmenity = (id: number) => {
        setSelectedAmenities(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(amenityId => amenityId !== id)
                : [...prevSelected, id]
        );
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
                                    <Picker.Item label="Select Vehicle Number" value="" />
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
                                />
                            )}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Arrival Time</Text>
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
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Add Pick up point</Text>
                            <TextInput
                                style={styles.input}
                                value={destinationPlace}
                                // onChangeText={(text) => setDestinationPlace(text)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Add drop off point</Text>
                            <TextInput
                                style={styles.input}
                                value={destinationPlace}
                                // onChangeText={(text) => setDestinationPlace(text)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Ticket Fare</Text>
                            <TextInput
                                style={styles.input}
                                value={destinationPlace}
                                // onChangeText={(text) => setDestinationPlace(text)}
                            />
                        </View>

                        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
                            <Text style={styles.imagePickerText}>Upload Bus Images (Max 5)</Text>
                        </TouchableOpacity>
                        <View style={styles.imagePreviewContainer}>
                            {busImages.map((image, index) => (
                            <Image key={index} source={{ uri: image.uri }} style={styles.previewImage} />
                            ))}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Vehicle Type</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Coach Type</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>
                        <Text style={{ flex: 1, fontWeight: 'bold', color:'#87CEEB'}}>Select Amenities:</Text>
                        <View style={{ paddingTop: 1, paddingBottom: 14, flexDirection: 'row', flexWrap: 'wrap' }}>
                            {[
                                { id: 1, source: require('@/assets/images/wifi-icon.png') },
                                { id: 2, source: require('@/assets/images/blanket.png') },
                                { id: 3, source: require('@/assets/images/bottle.png') },
                                { id: 4, source: require('@/assets/images/charger.png') },
                                { id: 5, source: require('@/assets/images/meal.png') },
                                { id: 6, source: require('@/assets/images/pillow.png') },
                                { id: 7, source: require('@/assets/images/tv.png') },
                            ].map(amenity => (
                                <TouchableOpacity
                                    key={amenity.id}
                                    onPress={() => toggleSelectAmenity(amenity.id)}
                                    style={{
                                        backgroundColor: selectedAmenities.includes(amenity.id) ? '#87CEEB' : 'transparent',
                                        padding: 5,
                                        borderRadius: 5,
                                        marginHorizontal: 5,
                                    }}>
                                    <Image source={amenity.source} style={{ width: 30, height: 30 }} />
                                </TouchableOpacity>
                            ))}
                        </View>
                       
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Do you provide courier parcel services</Text>
                             <Text>Yes</Text>
                             <Text>No</Text>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Do you Book Train Tickets</Text>
                            <Text>Yes</Text>
                            <Text>No</Text>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Add your PhonePe no and name here</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Add your QR photo here</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Add your Seating Arrengement Chart photo here</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Add your Office Name</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile No 1</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile No 2</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile No 3</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile No 4</Text>
                            <TextInput
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Add Office Address</Text>
                            <TextInput
                                style={styles.input}
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
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 2,
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
    checkboxContainer: {
        flexDirection: 'row',
        marginTop: 8,
      },
      checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
      },
      checkbox: {
        marginRight: 8,
      },
      checkboxLabel: {
        fontSize: 16,
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