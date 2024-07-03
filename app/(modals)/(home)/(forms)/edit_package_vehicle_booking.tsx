import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    SafeAreaView,
    ScrollView,
    Platform,
    Alert,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import DateTimePicker from '@react-native-community/datetimepicker';

const EditPackageBookingForm: React.FC = () => {
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [otherVehicleNumber, setOtherVehicleNumber] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [alternateNumber, setAlternateNumber] = useState("");
    const [kmStarting, setKmStarting] = useState("");
    const [perKmRate, setPerKmRate] = useState("");
    const [advancedAmount, setAdvancedAmount] = useState("");
    const [remainingAmount, setRemainingAmount] = useState("");
    const [departurePlace, setDeparturePlace] = useState("");
    const [destinationPlace, setDestinationPlace] = useState("");
    const [departureTime, setDepartureTime] = useState<Date | undefined>(undefined);
    const [returnTime, setReturnTime] = useState<Date | undefined>(undefined);
    const [showDepartureTimePicker, setShowDepartureTimePicker] = useState(false);
    const [showReturnTimePicker, setShowReturnTimePicker] = useState(false);
    const [toll, setToll] = useState("");
    const [otherStateTax, setOtherStateTax] = useState("");
    const [instructions, setInstructions] = useState("");
    const [addNote, setAddNote] = useState("");
    const [entryParking, setEntryParking] = useState("");
    const [loading, setLoading] = useState(false);
    const { apiCaller, editData } = useGlobalContext();

    useEffect(() => {
        if (editData) {
            if (editData.vehicle) {
                setVehicleNumber(editData.vehicle.number);
            }
            setOtherVehicleNumber(editData.otherVehicle);
            setCustomerName(editData.customerName);
            setMobileNumber(editData.mobileNumber);
            setAlternateNumber(editData.alternateNumber);
            setKmStarting(editData.kmStarting);
            setPerKmRate(editData.perKmRateInINR);
            setAdvancedAmount(editData.advanceAmountInINR);
            setRemainingAmount(editData.remainingAmountInINR);
            setDeparturePlace(editData.departurePlace);
            setDestinationPlace(editData.destinationPlace);
            setDepartureTime(new Date(editData.departureTime));
            setReturnTime(new Date(editData.returnTime));
            setToll(editData.tollInINR);
            setOtherStateTax(editData.otherStateTaxInINR);
            setInstructions(editData.instructions);
            setAddNote(editData.note);
            setEntryParking(editData.advancePlace);
        }
    }, [editData])

    const handleBooking = async () => {
        if (!vehicleNumber || !otherVehicleNumber || !customerName || !mobileNumber || !alternateNumber || !kmStarting || !perKmRate || !advancedAmount || !remainingAmount || !departurePlace || !destinationPlace || !departureTime || !returnTime || !toll || !otherStateTax || !instructions || !addNote || !entryParking) {
            Alert.alert("Please fill all fields.");
            return;
        }

        const updatedBooking = {
            vehicleId: vehicleNumber,
            otherVehicleId: otherVehicleNumber,
            customerName,
            mobileNumber,
            alternateNumber,
            kmStarting,
            perKmRateInINR: perKmRate,
            advanceAmountInINR: advancedAmount,
            remainingAmountInINR: remainingAmount,
            departurePlace,
            destinationPlace,
            departureTime: departureTime?.toISOString(),
            returnTime: returnTime?.toISOString(),
            tollInINR: toll,
            otherStateTaxInINR: otherStateTax,
            instructions,
            note: addNote,
            advancePlace: entryParking,
        };

        setLoading(true);
        try {
            await apiCaller.put(`/api/packageBooking/${editData._id}`, updatedBooking);
            setLoading(false);
            Alert.alert("Success", "Booking updated successfully!");
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to update booking. Please try again.");
        }
    };

    const onChangeDepartureTime = (event: any, selectedDate?: Date) => {
        setShowDepartureTimePicker(false);
        if (selectedDate) {
            setDepartureTime(selectedDate);
        }
    };

    const onChangeReturnTime = (event: any, selectedDate?: Date) => {
        setShowReturnTimePicker(false);
        if (selectedDate) {
            setReturnTime(selectedDate);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Vehicle Number</Text>
                        <TextInput
                            style={[styles.input]}
                            value={vehicleNumber}
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Other Vehicle Number</Text>
                        <TextInput
                            style={styles.input}
                            value={otherVehicleNumber}
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Customer Name</Text>
                        <TextInput
                            style={styles.input}
                            value={customerName}
                            onChangeText={(text) => setCustomerName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mobile Number</Text>
                        <TextInput
                            style={styles.input}
                            value={mobileNumber}
                            onChangeText={(text) => setMobileNumber(text)}
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
                        <Text style={styles.label}>KM Starting</Text>
                        <TextInput
                            style={styles.input}
                            value={kmStarting}
                            onChangeText={(text) => setKmStarting(text)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Per KM Rate</Text>
                        <TextInput
                            style={styles.input}
                            value={perKmRate}
                            onChangeText={(text) => setPerKmRate(text)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Advanced Amount</Text>
                        <TextInput
                            style={styles.input}
                            value={advancedAmount}
                            onChangeText={(text) => setAdvancedAmount(text)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Remaining Amount</Text>
                        <TextInput
                            style={styles.input}
                            value={remainingAmount}
                            onChangeText={(text) => setRemainingAmount(text)}
                            keyboardType="numeric"
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
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowDepartureTimePicker(true)}
                        >
                            <Text>{departureTime ? departureTime.toLocaleTimeString() : "Select Time"}</Text>
                        </TouchableOpacity>
                        {showDepartureTimePicker && (
                            <DateTimePicker
                                value={departureTime || new Date()}
                                mode="time"
                                display="default"
                                onChange={onChangeDepartureTime}
                            />
                        )}
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Return Time</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowReturnTimePicker(true)}
                        >
                            <Text>{returnTime ? returnTime.toLocaleTimeString() : "Select Time"}</Text>
                        </TouchableOpacity>
                        {showReturnTimePicker && (
                            <DateTimePicker
                                value={returnTime || new Date()}
                                mode="time"
                                display="default"
                                onChange={onChangeReturnTime}
                            />
                        )}
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Toll</Text>
                        <TextInput
                            style={styles.input}
                            value={toll}
                            onChangeText={(text) => setToll(text)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Other State Tax</Text>
                        <TextInput
                            style={styles.input}
                            value={otherStateTax}
                            onChangeText={(text) => setOtherStateTax(text)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Instructions</Text>
                        <TextInput
                            style={styles.input}
                            value={instructions}
                            onChangeText={(text) => setInstructions(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Add Note</Text>
                        <TextInput
                            style={styles.input}
                            value={addNote}
                            onChangeText={(text) => setAddNote(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Entry Parking</Text>
                        <TextInput
                            style={styles.input}
                            value={entryParking}
                            onChangeText={(text) => setEntryParking(text)}
                        />
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleBooking}
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
        justifyContent: 'center'
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

export default EditPackageBookingForm;