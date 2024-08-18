import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, {useState} from 'react'
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";


const add_holiday_yatra = () => {

    const [busImages, setBusImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [loading, setLoading] = useState(false);

    const handleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: 1,
        });
    
        if (!result.canceled) {
          setBusImages(result.assets);
        }
      };
 

  return (
    <SafeAreaView style={styles.container}> 
         <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Agency Name</Text>
                        <TextInput
                            style={styles.input}
                            // value={name}
                            // onChangeText={(text) => setName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mobile No 1</Text>
                        <TextInput
                            style={styles.input}
                            // value={name}
                            // onChangeText={(text) => setName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mobile No 2</Text>
                        <TextInput
                            style={styles.input}
                            // value={name}
                            // onChangeText={(text) => setName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            style={styles.input}
                            // value={name}
                            // onChangeText={(text) => setName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tour Name</Text>
                        <TextInput
                            style={styles.input}
                            // value={name}
                            // onChangeText={(text) => setName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Add City</Text>
                        <TextInput
                            style={styles.input}
                            // value={name}
                            // onChangeText={(text) => setName(text)}
                        />
                    </View>

                    <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
                        <Text style={styles.imagePickerText}>Upload  Images (Max 5)</Text>
                    </TouchableOpacity>
                    <View style={styles.imagePreviewContainer}>
                        {busImages.map((image, index) => (
                        <Image key={index} source={{ uri: image.uri }} style={styles.previewImage} />
                        ))}
                    </View>

                <View style={styles.modalButtons}>
                    <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                  
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
  )
}

export default add_holiday_yatra

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    scrollView: {
        flex: 1,
        paddingTop: 10,
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
    imagePreviewContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        marginBottom: 15,
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
   
      previewImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginBottom: 10,
      },
      modalButtons: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 10,
      },
      modalButton: {
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 10,
      },
      modalButtonText: {
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 4
      },
     
})