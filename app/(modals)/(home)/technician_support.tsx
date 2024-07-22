import React, { useEffect, useState } from "react";
import {
    View,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
    TextInput,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    Linking,
    Platform,
} from "react-native";
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Picker } from '@react-native-picker/picker';
import { State, City } from 'country-state-city';

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

interface Technician {
    _id: string;
    technicianType: string;
    name: string;
    city: string;
    state: string;
    mobileNumber: string;
    alternateNumber: string;
    vehicleType: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const TechnicianSupport: React.FC = () => {
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState<null | string>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [vehicleFilter, setVehicleFilter] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const { apiCaller, setEditData, refresh } = useGlobalContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const states = State.getStatesOfCountry('IN');
    const cities = City.getCitiesOfState('IN', stateFilter);

    const fetchTechnicians = async (page: number, isLoadMore: boolean = false) => {
        if (!hasMore && isLoadMore) return;

        try {
            setLoading(true);
            const response = await apiCaller.get(`/api/technician?page=${page}`);
            const newTechnicians = response.data.data;
            
            if (isLoadMore) {
                setTechnicians(prev => [...prev, ...newTechnicians]);
                setFilteredTechnicians(prev => [...prev, ...newTechnicians]);
            } else {
                setTechnicians(newTechnicians);
                setFilteredTechnicians(newTechnicians);
            }

            setHasMore(newTechnicians.length > 0);
            setCurrentPage(page);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTechnicians(1);
    }, [refresh]);

    useEffect(() => {
        const filtered = technicians.filter(tech =>
            (tech.technicianType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tech.city.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (vehicleFilter === '' || tech.vehicleType === vehicleFilter) &&
            (stateFilter === '' || tech.state === stateFilter) &&
            (cityFilter === '' || tech.city === cityFilter)
        );
        setFilteredTechnicians(filtered);
    }, [searchQuery, vehicleFilter, stateFilter, cityFilter, technicians]);

    const handleDelete = async () => {
        await apiCaller.delete(`/api/technician?technicianId=${idToDelete}`);
        setShowDeleteModal(false);
        fetchTechnicians(1);
    };

    const dialNumber = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    const handleVehicleFilterChange = (itemValue: string) => {
        if (itemValue == 'all') {
            setVehicleFilter('');
        } else {
            setVehicleFilter(itemValue);
        }
    };

    const handleStateFilterChange = (itemValue: string) => {
        if (itemValue == 'all') {
            setStateFilter('');
            setCityFilter('');
        } else {
            setStateFilter(itemValue);
            setCityFilter('');
        }
    };

    const handleCityFilterChange = (itemValue: string) => {
        if (itemValue == 'all') {
            setCityFilter('');
        } else {
            setCityFilter(itemValue);
        }
    };

    const renderTechnicianItem = ({ item }: { item: Technician }) => (
        <View style={styles.card}>
            <View style={[styles.cardHeader, { marginBottom: 2, marginTop: 5 }]}>
                <TouchableOpacity onPress={() => dialNumber(item.mobileNumber)}>
                    <MaterialIcons name="phone-in-talk" size={24} color={Colors.darkBlue} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => dialNumber(item.alternateNumber)}>
                    <MaterialIcons name="phone-in-talk" size={24} color={Colors.secondary} />
                </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>Technician Name: <Text style={{ color: "black" }}> {item.name}</Text></Text>
            <Text style={styles.cardText}>Technician Type: <Text style={{ color: "black" }}> {item.technicianType}</Text></Text>
            <Text style={styles.cardText}>City: <Text style={{ color: "black" }}>{item.city}</Text></Text>
            <Text style={styles.cardText}>State: <Text style={{ color: "black" }}>{item.state}</Text></Text>
            <Text style={styles.cardText}>Vehicle Type: <Text style={{ color: "black" }}> {item.vehicleType}</Text></Text>
        </View>
    );

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchTechnicians(currentPage + 1, true);
        }
    };

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.loaderFooter}>
                <ActivityIndicator size="small" color={Colors.darkBlue} />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <FontAwesome5 name="search" size={18} color={Colors.secondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search technician category..."
                    placeholderTextColor={Colors.secondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.filterContainer}>
                <View style={styles.vehicleFilterContainer}>
                    <Picker
                        selectedValue={vehicleFilter}
                        style={styles.vehiclePicker}
                        onValueChange={handleVehicleFilterChange}
                    >
                        <Picker.Item label="All Vehicle Types" value="all" />
                        <Picker.Item label="CAR" value="CAR" />
                        <Picker.Item label="BUS" value="BUS" />
                        <Picker.Item label="TRUCK" value="TRUCK" />
                        <Picker.Item label="TAMPO" value="TAMPO" />
                    </Picker>
                </View>

                <View style={styles.locationFilterContainer}>
                    <Picker
                        selectedValue={stateFilter}
                        style={styles.locationPicker}
                        onValueChange={handleStateFilterChange}
                    >
                        <Picker.Item label="All States" value="all" />
                        {states.map((state) => (
                            <Picker.Item key={state.isoCode} label={state.name} value={state.isoCode} />
                        ))}
                    </Picker>

                    <Picker
                        selectedValue={cityFilter}
                        style={styles.locationPicker}
                        onValueChange={handleCityFilterChange}
                        enabled={!!stateFilter}
                    >
                        <Picker.Item label="All Cities" value="all" />
                        {cities.map((city) => (
                            <Picker.Item key={city.name} label={city.name} value={city.name} />
                        ))}
                    </Picker>
                </View>
            </View>

            <TouchableOpacity onPress={() => router.push("add_technician")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Technician</Text>
            </TouchableOpacity>

            <FlatList
                data={filteredTechnicians}
                renderItem={renderTechnicianItem}
                keyExtractor={(item) => item._id}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
            />

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
                                <Text style={styles.modalText}>Are you sure you want to delete this technician?</Text>
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 10,
        paddingVertical: 5,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: Colors.secondary,
    },
    filterContainer: {
        marginBottom: 1,
    },
    vehicleFilterContainer: {
        marginBottom: -5,
    },
    locationFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    vehiclePicker: {
        width: '100%',
    },
    locationPicker: {
        flex: 1,
        marginHorizontal: 5,
    },
    picker: {
        flex: 1,
        marginHorizontal: 5,
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
    cardText: {
        marginBottom: 8,
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 13,
    },
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
    modalButtons: {
        flexDirection: "row",
        width: '100%',
        justifyContent: "space-between"
    },
    modalButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        width: '48%'
    },
    modalButtonText: {
        fontWeight: "bold",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    loaderFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default TechnicianSupport;