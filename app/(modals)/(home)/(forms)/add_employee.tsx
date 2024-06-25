import React, { useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
    SafeAreaView,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors"; // Replace with your colors constant
import { useGlobalContext } from "@/context/GlobalProvider"; // Ensure you have this hook or context

const AddEmployeeScreen: React.FC = () => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [employerType, setEmployerType] = useState("");
    const [selfie, setSelfie] = useState<string | null>(null);
    const [aadharImage, setAadharImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { apiCaller } = useGlobalContext(); // Ensure your global context provides an apiCaller

    const handleAddEmployee = async () => {
        if (!name || !mobile || !password || !city || !state || !employerType || !selfie || !aadharImage) {
            Alert.alert("Please fill all fields and provide both images.");
            return;
        }

        if (mobile.length !== 10) {
            Alert.alert("Please enter a valid 10-digit phone number.");
            return;
        }

        const newEmployee = {
            name,
            mobileNumber:mobile,
            password,
            city,
            state,
            employeeType:employerType,
            photo:selfie,
            aadharCard:aadharImage,
        };

        setLoading(true);
        try {
            await apiCaller.post('/api/employee', newEmployee, { headers: { 'Content-Type': 'multipart/form-data' } });
            setLoading(false);
            resetForm();
            Alert.alert("Success", "Employee added successfully!");
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to add employee. Please try again.");
        }
    };

    const handleImagePicker = async (type: "selfie" | "aadhar") => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            if (type === "selfie") {
                setSelfie(result.assets[0].uri);
            } else {
                setAadharImage(result.assets[0].uri);
            }
        }
    };

    const resetForm = () => {
        setName("");
        setMobile("");
        setPassword("");
        setCity("");
        setState("");
        setEmployerType("");
        setSelfie(null);
        setAadharImage(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Employee Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mobile No.</Text>
                        <TextInput
                            style={styles.input}
                            value={mobile}
                            onChangeText={(text) => setMobile(text)}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={styles.input}
                            value={city}
                            onChangeText={(text) => setCity(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>State</Text>
                        <TextInput
                            style={styles.input}
                            value={state}
                            onChangeText={(text) => setState(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Employee Type</Text>
                        <TextInput
                            style={styles.input}
                            value={employerType}
                            onChangeText={(text) => setEmployerType(text)}
                        />
                    </View>

                    <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("selfie")}>
                        <Text style={styles.imagePickerText}>Select Selfie</Text>
                    </TouchableOpacity>
                    {selfie && <Image source={{ uri: selfie }} style={styles.previewImage} />}

                    <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("aadhar")}>
                        <Text style={styles.imagePickerText}>Select Aadhar Card Image</Text>
                    </TouchableOpacity>
                    {aadharImage && <Image source={{ uri: aadharImage }} style={styles.previewImage} />}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleAddEmployee}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.buttonText, { color: "#fff" }]}>Submit</Text>
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
        backgroundColor: "#ffffff",
    },
    scrollView: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
        paddingHorizontal: 20,
    },
    content: {
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
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddEmployeeScreen;
