import React, { useState } from "react";
import {
    View,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
    TextInput,
    SafeAreaView,
    ScrollView,
    Alert,
    Platform,
    ActivityIndicator,
} from "react-native";
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { dailyRoutes } from "@/constants/dummy";
import { router } from "expo-router";

interface BlurOverlayProps {
    visible: boolean;
    onRequestClose: () => void;
}

const BlurOverlay: React.FC<BlurOverlayProps> = ({ visible, onRequestClose }) => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}
    >
        <TouchableWithoutFeedback onPress={onRequestClose}>
            <BlurView intensity={90} tint="light" style={styles.overlay} />
        </TouchableWithoutFeedback>
    </Modal>
);

const DailyRouteVehicles: React.FC = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddDriverModal, setShowAddDriverModal] = useState(false);
    const [driverName, setDriverName] = useState("");
    const [driverName2, setDriverName2] = useState("");
    const [cleanerName, setCleanerName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDelete = () => {
        // Implement delete logic here
        console.log("Deleting route...");
        setShowDeleteModal(false);
    };

    const handleAddDriver = () => {
        if (!driverName || !driverName2 || !cleanerName) {
            Alert.alert("Please fill all fields.");
            return;
        }

        const newDriverData = {
            driverName,
            driverName2,
            cleanerName,
        };

        console.log("New Driver Data:", newDriverData);

        // Simulate loading state (you can replace this with actual API call)
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            resetForm();
            Alert.alert("Success", "Driver added successfully!");
        }, 1500);
    };

    const resetForm = () => {
        setDriverName("");
        setDriverName2("");
        setCleanerName("");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <FontAwesome5 name="search" size={18} color={Colors.secondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    placeholderTextColor={Colors.secondary}
                />
            </View>

            <TouchableOpacity onPress={() => router.push("add_daily_route_vehicles")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Route</Text>
            </TouchableOpacity>

            <ScrollView style={styles.routesList}>
                {dailyRoutes.map((route, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <TouchableOpacity style={styles.editButton} onPress={() => setShowAddDriverModal(true)}>
                                <Text style={styles.editButtonText}>Add Driver</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.editButton}>
                                <Text style={styles.editButtonText}>Edit Route</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
                                <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }} >
                            <Text style={{ fontWeight: "semibold", fontSize: 14 }} >Departure</Text>
                            <Text style={{ fontWeight: "semibold", fontSize: 14 }} >Destination</Text>
                        </View>
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }} >
                            <Text style={{ fontWeight: "semibold", fontSize: 15 }} >{route.departure}</Text>
                            <MaterialIcons name="keyboard-double-arrow-right" size={24} color={Colors.darkBlue} />
                            <Text style={{ fontWeight: "semibold", fontSize: 15 }} >{route.destination}</Text>
                        </View>

                        <Text style={styles.cardText}>
                            Vehicle Number: <Text style={{ color: "black" }}>{route.vehicleNumber}</Text>
                        </Text>
                        <Text style={styles.cardText}>
                            Departure Time: <Text style={{ color: "black" }}>{route.departureTime}</Text>
                        </Text>
                        <Text style={styles.cardText}>
                            Cleaner Name: <Text style={{ color: "black" }}>{route.cleanerName}</Text>
                        </Text>
                        <Text style={styles.cardText}>
                            Driver Name 1: <Text style={{ color: "black" }}>{route.driverName1}</Text>
                        </Text>
                        <Text style={styles.cardText}>
                            Driver Name 2: <Text style={{ color: "black" }}>{route.driverName2}</Text>
                        </Text>

                    </View>
                ))}
            </ScrollView>

            {/* Delete Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showDeleteModal}
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <BlurOverlay visible={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)} />

                <TouchableWithoutFeedback onPress={() => setShowDeleteModal(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>Are you sure you want to delete this route?</Text>
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#ccc" }]} onPress={() => setShowDeleteModal(false)}>
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]} onPress={handleDelete}>
                                        <Text style={[styles.modalButtonText, { color: "#fff" }]}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Add Driver Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showAddDriverModal}
                onRequestClose={() => setShowAddDriverModal(false)}
            >
                <BlurOverlay visible={showAddDriverModal} onRequestClose={() => setShowAddDriverModal(false)} />

                <TouchableWithoutFeedback onPress={() => setShowAddDriverModal(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <ScrollView style={styles.modalScroll}>
                                <View style={styles.modalContent}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Driver Name</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={driverName}
                                            onChangeText={(text) => setDriverName(text)}
                                        />
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Driver Name 2</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={driverName2}
                                            onChangeText={(text) => setDriverName2(text)}
                                        />
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Cleaner Name</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={cleanerName}
                                            onChangeText={(text) => setCleanerName(text)}
                                        />
                                    </View>

                                    <View style={styles.modalButtons}>
                                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#ccc" }]} onPress={resetForm}>
                                            <Text style={styles.modalButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                                            onPress={handleAddDriver}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="#fff" />
                                            ) : (
                                                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Add Driver</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#ffffff",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
        paddingVertical: 5,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: Colors.secondary,
    },
    addButton: {
        backgroundColor: Colors.darkBlue,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
        width: 140,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    routesList: {
        flex: 1,
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 5,
        marginBottom: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        position: "relative",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 10,
        gap: 30,
        alignItems: "center",
    },
    editButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 10,
        borderRadius: 5,
        paddingVertical: 5,
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12
    },
    cardText: {
        marginBottom: 8,
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 13,
    },
    // Modal Styles
    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        marginVertical: 'auto'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalScroll: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
        paddingHorizontal: 20,
        marginVertical: 'auto'
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
        maxHeight: 400,
    },
    modalText: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: "center",
    },
    inputGroup: {
        marginBottom: 15,
        width: '100%'
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
        width: '100%'
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
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DailyRouteVehicles;
