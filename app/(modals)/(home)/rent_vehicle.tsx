import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    SafeAreaView,
    ScrollView,
    Image,
    Dimensions,
} from "react-native";
import PagerView from "react-native-pager-view";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { sell_cars } from "@/constants/dummy";
import { useState } from "react";

const { width: viewportWidth } = Dimensions.get("window");

const SellVehicleScreen: React.FC = () => {
    const [activeSlide, setActiveSlide] = useState(0);

    const renderPagerItem = (item: string, index: number) => {
        return (
            <View style={styles.carouselItem} key={index}>
                <Image source={{ uri: item }} style={styles.carouselImage} />
            </View>
        );
    };

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

                {sell_cars.map((car, index) => (
                    <View key={index} style={styles.card}>
                        <PagerView
                            style={styles.pagerView}
                            initialPage={0}
                            onPageSelected={(e) => setActiveSlide(e.nativeEvent.position)}
                            useNext={true}
                        >
                            {car.imageUrl.map((image, imageIndex) => renderPagerItem(image, imageIndex))}
                        </PagerView>
                        <View style={styles.paginationContainer}>
                            {car.imageUrl.map((_, imageIndex) => (
                                <View
                                    key={imageIndex}
                                    style={[
                                        styles.dotStyle,
                                        { opacity: imageIndex === activeSlide ? 1 : 0.4 },
                                    ]}
                                />
                            ))}
                        </View>
                        <Text style={styles.cardText}>Vehicle No: <Text style={{ color: "black" }}>{car.vehicleNumber}</Text></Text>
                        <Text style={styles.cardText}>Model: <Text style={{ color: "black" }}>{car.vehicleModel}</Text></Text>
                        <Text style={styles.cardText}>Contact No: <Text style={{ color: "black" }}>{car.contactNumber}</Text></Text>
                        <Text style={styles.cardText}>Location: <Text style={{ color: "black" }}>{car.location}</Text></Text>
                    </View>
                ))}
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

export default SellVehicleScreen;
