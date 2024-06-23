import React from "react";
import {
    View,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
    Image,
    TextInput,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { cars } from "@/constants/dummy";
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

const CarListScreen: React.FC = () => {
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [selectedCarImage, setSelectedCarImage] = React.useState<Array<string> | null>(null);
    const [showPhotoModal, setShowPhotoModal] = React.useState(false);

    const handleDelete = () => {
        // Implement delete logic here
        console.log("Deleting car...");
        setShowDeleteModal(false);
    };

    const handleViewPhoto = (imageUrl: Array<string>) => {
        setSelectedCarImage(imageUrl);
        setShowPhotoModal(true);
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

            <TouchableOpacity onPress={() => router.push("add_car")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Car</Text>
            </TouchableOpacity>

            <ScrollView style={styles.carsList}>
                {cars.map((car, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <TouchableOpacity style={styles.editButton}>
                                <Text style={styles.editButtonText}>Edit form</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
                                <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.cardText}>Vehicle Number: <Text style={{ color: "black" }}>{car.vehicleNumber}</Text></Text>
                        <Text style={styles.cardText}>Seating Capacity: <Text style={{ color: "black" }}>{car.seatingCapacity}</Text></Text>
                        <Text style={styles.cardText}>Vehicle Model: <Text style={{ color: "black" }}>{car.vehicleModel}</Text></Text>
                        <Text style={styles.cardText}>Location: <Text style={{ color: "black" }}>{car.location}</Text></Text>
                        <Text style={styles.cardText}>Car Name: <Text style={{ color: "black" }}>{car.carName}</Text></Text>
                        <Text style={styles.cardText}>Contact Number: <Text style={{ color: "black" }}>{car.contactNumber}</Text></Text>
                        <Text style={styles.cardText}>Features: <Text style={{ color: "black" }}>{car.features.join(', ')}</Text></Text>
                        <TouchableOpacity style={styles.viewPhotoButton} onPress={() => handleViewPhoto(car.imageUrl)}>
                            <Text style={styles.viewPhotoButtonText}>View Photos</Text>
                        </TouchableOpacity>
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

                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to delete this car?</Text>
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
            </Modal>

            {/* Photo Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showPhotoModal}
                onRequestClose={() => setShowPhotoModal(false)}
            >
                <BlurOverlay visible={showPhotoModal} onRequestClose={() => setShowPhotoModal(false)} />

                <View style={styles.photoModalContainer}>
                    <TouchableWithoutFeedback onPress={() => setShowPhotoModal(false)}>
                        <View style={styles.photoModalOverlay} />
                    </TouchableWithoutFeedback>
                    <ScrollView style={styles.photoModalContent} contentContainerStyle={styles.photoModalContentContainer}>
                        {selectedCarImage && selectedCarImage.map((t, index) => (
                            <Image key={index} source={{ uri: t }} style={styles.fullImage} />
                        ))}
                    </ScrollView>
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
    carsList: {
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
    carImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        position: "absolute",
        right: 30,
        top: 70,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 10,
        gap: 50,
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
    },
    cardText: {
        marginBottom: 10,
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 15,
    },
    viewPhotoButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 10,
        borderRadius: 5,
        paddingVertical: 5,
        alignItems: "center",
    },
    viewPhotoButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    // Modal Styles
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
    modalButtons: {
        flexDirection: "row",
        justifyContent: "center",
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoModalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    photoModalContent: {
        width: '80%',
        height: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
    },
    photoModalContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
});

export default CarListScreen;
