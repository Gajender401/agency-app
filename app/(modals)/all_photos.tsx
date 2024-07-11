import React, { useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    Image,
    View,
    Dimensions,
    TouchableOpacity,
    Button
} from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const images = [
    'https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg',
    'https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg',
    'https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg'
];

const numColumns = 2;
const imageSize = Dimensions.get('window').width / numColumns;

const GalleryGridScreen: React.FC = () => {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const toggleImageSelection = (image: string) => {
        setSelectedImages(prev => 
            prev.includes(image)
                ? prev.filter(img => img !== image)
                : [...prev, image]
        );
    };

    const shareImages = async () => {
        if (!(await Sharing.isAvailableAsync())) {
            alert("Sharing isn't available on your platform");
            return;
        }

        const localFiles = await Promise.all(
            selectedImages.map(async (imageUrl, index) => {
                const fileName = `image_${index}.jpg`;
                const filePath = `${FileSystem.cacheDirectory}${fileName}`;
                await FileSystem.downloadAsync(imageUrl, filePath);
                return filePath;
            })
        );

        try {
            for (const file of localFiles) {
                await Sharing.shareAsync(file, {
                    dialogTitle: 'Share this image',
                    mimeType: 'image/jpeg',
                    UTI: 'public.jpeg',
                });
            }
        } catch (error) {
            console.error('Error sharing images:', error);
        }
    };

    const renderItem = ({ item }: { item: string }) => (
        <TouchableOpacity 
            style={styles.imageContainer}
            onPress={() => toggleImageSelection(item)}
        >
            <Image
                source={{ uri: item }}
                style={[
                    styles.image,
                    selectedImages.includes(item) && styles.selectedImage
                ]}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={images}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={numColumns}
            />
            <Button 
                title={`Share (${selectedImages.length})`}
                onPress={shareImages}
                disabled={selectedImages.length === 0}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    imageContainer: {
        flex: 1,
        margin: 2,
    },
    image: {
        width: imageSize - 4,
        height: imageSize - 4,
    },
    selectedImage: {
        opacity: 0.7,
        borderWidth: 2,
        borderColor: 'gray',
    },
});

export default GalleryGridScreen;
