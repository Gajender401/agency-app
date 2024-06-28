import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    SafeAreaView,
    ScrollView,
    Image,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import PagerView from "react-native-pager-view";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors"; // Make sure to import your Colors from the correct path
import { useGlobalContext } from "@/context/GlobalProvider"; // Adjust path as per your project structure

const { width: viewportWidth } = Dimensions.get("window");

interface Vehicle {
    _id: string;
    number: string;
    seatingCapacity: number;
    model: string;
    bodyType: string;
    chassisBrand: string;
    location: string;
    contactNumber: string;
    photos: string[];
    isAC: boolean;
    isForRent: boolean;
    isForSell: boolean;
    type: string;
}

const SellVehicleScreen: React.FC = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const { apiCaller, token } = useGlobalContext(); // Ensure useGlobalContext is correctly imported and used
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const renderPagerItem = (item: string, index: number) => {
        return (
            <View style={styles.carouselItem} key={index}>
                <Image source={{ uri: item }} style={styles.carouselImage} />
            </View>
        );
    };

    const filterByType = (data: Vehicle[]): Vehicle[] => {
        return data.filter(vehicle => vehicle.isForRent === true);
      };

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await apiCaller.get('/api/vehicle/purpose/RENT/');
            const filteredData = filterByType(response.data.data)
            setVehicles(filteredData);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.searchContainer}>
                    <FontAwesome5 name="search" size={18} color={Colors.secondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        placeholderTextColor={Colors.secondary}
                    />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={Colors.darkBlue} style={{ marginTop: 20 }} />
                ) : (
                    vehicles.map((vehicle, index) => (
                        <View key={index} style={styles.card}>
                            <PagerView
                                style={styles.pagerView}
                                initialPage={0}
                                onPageSelected={(e) => setActiveSlide(e.nativeEvent.position)}
                                useNext={true}
                            >
                                {vehicle.photos.map((photo, photoIndex) => renderPagerItem(photo, photoIndex))}
                            </PagerView>
                            <View style={styles.paginationContainer}>
                                {vehicle.photos.map((_, photoIndex) => (
                                    <View
                                        key={photoIndex}
                                        style={[
                                            styles.dotStyle,
                                            { opacity: photoIndex === activeSlide ? 1 : 0.4 },
                                        ]}
                                    />
                                ))}
                            </View>
                            <Text style={styles.cardText}>Vehicle No: <Text style={{ color: "black" }}>{vehicle.number}</Text></Text>
                            <Text style={styles.cardText}>Model: <Text style={{ color: "black" }}>{vehicle.model}</Text></Text>
                            <Text style={styles.cardText}>Contact No: <Text style={{ color: "black" }}>{vehicle.contactNumber}</Text></Text>
                            <Text style={styles.cardText}>Location: <Text style={{ color: "black" }}>{vehicle.location}</Text></Text>
                        </View>
                    ))
                )}
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
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 5,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        marginBottom: 20,
    },
    cardText: {
        marginBottom: 10,
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 15,
    },
    carouselItem: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        overflow: "hidden",
    },
    carouselImage: {
        width: viewportWidth * 0.9,
        height: 200,
    },
    pagerView: {
        width: viewportWidth * 0.8,
        height: 200,
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 8,
    },
    dotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.darkBlue,
        marginHorizontal: 4,
    },
});

export default SellVehicleScreen;
