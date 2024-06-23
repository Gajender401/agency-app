import React from "react";
import {
    View,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
    SafeAreaView,
    ScrollView,
    TextInput,
    Image,
} from "react-native";
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { serviceRecords } from "@/constants/dummy";  // assuming you have a similar dummy data file for service records
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

const ServiceHistoryScreen: React.FC = () => {
    const [selectedBill, setSelectedBill] = React.useState<string | null>(null);
    const [showBillModal, setShowBillModal] = React.useState(false);

    const handleViewBill = (billUrl: string) => {
        console.log("Bill URL:", billUrl);  // Log the bill URL to verify it's correct
        setSelectedBill(billUrl);
        setShowBillModal(true);
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

            <TouchableOpacity onPress={() => router.push("add_vehicle_inspection")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Vehicle</Text>
            </TouchableOpacity>

            <ScrollView style={styles.recordsList}>
                {serviceRecords.map((record, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.cardText}>Garage Number: <Text style={{ color: "black" }}> {record.garageNumber}</Text></Text>
                        <Text style={styles.cardText}>Garage Name: <Text style={{ color: "black" }}> {record.garageName}</Text></Text>
                        <Text style={styles.cardText}>Date: <Text style={{ color: "black" }}> {record.date}</Text></Text>
                        <Text style={styles.cardText}>Work Details: <Text style={{ color: "black" }}> {record.workDetails}</Text></Text>
                        <TouchableOpacity style={styles.viewBillButton} onPress={() => handleViewBill(record.billUrl)}>
                            <Text style={styles.viewBillButtonText}>View Bill</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Bill Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showBillModal}
                onRequestClose={() => setShowBillModal(false)}
            >
                <BlurOverlay visible={showBillModal} onRequestClose={() => setShowBillModal(false)} />

                <View style={styles.modalContainer}>
                    {selectedBill ? (
                        <Image source={{ uri: selectedBill }} style={styles.fullImage} />
                    ) : (
                        <Text style={styles.modalText}>No image available</Text>
                    )}

                </View>
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
    recordsList: {
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
    cardText: {
        marginBottom: 10,
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 15,
    },
    viewBillButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 10,
        borderRadius: 5,
        paddingVertical: 5,
        alignItems: "center",
    },
    viewBillButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    // Modal Styles
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
        minWidth: 300,
    },
    modalText: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: "center",
    },
    fullImage: {
        width: '80%',
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    addButton: {
        backgroundColor: Colors.darkBlue,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
        width: 140,
    },
});

export default ServiceHistoryScreen;
