import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    Image,
    Alert,
    Animated,
    Vibration,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { useGlobalContext } from '@/context/GlobalProvider';

interface OtpInputRef {
    focus: () => void;
}

const ForgotPasswordScreen: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const otpInputs = useRef<OtpInputRef[]>([]);
    const [shakeAnimation] = useState<Animated.Value>(new Animated.Value(0));
    const [isShaking, setIsShaking] = useState<boolean>(false);
    const {setMobileNumber} = useGlobalContext()

    const handleSendOTP = async (): Promise<void> => {
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_URL}api/user/reset/sendOtp`, {
                mobileNumber: `91${phoneNumber}`
            });
            if (response.data.success) {
                setOtpSent(true);
                Alert.alert("Success", "OTP sent successfully!");
            } else {
                Alert.alert("Error", "Failed to send OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            Alert.alert("Error", "An error occurred. Please try again later.");
        }
    };

    const handleVerifyOTP = async (): Promise<void> => {
        const enteredOtp = otp.join('');
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_URL}api/user/reset/verifyOtp`, {
                mobileNumber: `91${phoneNumber}`,
                otp: enteredOtp
            });
            if (response.data.success) {
                setMobileNumber(`91${phoneNumber}`)
                Alert.alert("Success", "OTP verified successfully!");
                router.push("/(modals)/resetPassword");
            } else {
                triggerShakeAnimation();
                Alert.alert("Error", "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            triggerShakeAnimation();
            Alert.alert("Error", "An error occurred. Please try again later.");
        }
    };

    const triggerShakeAnimation = (): void => {
        setIsShaking(true);
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start(() => {
            setIsShaking(false);
        });
        Vibration.vibrate(400);
        setOtp(['', '', '', '']);
        otpInputs.current[0]?.focus();
    };

    const handleOtpChange = (text: string, index: number): void => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text.length === 1 && index < 3) {
            otpInputs.current[index + 1]?.focus();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />

            <View style={styles.marginTop150}>
                <Text style={styles.headingText}>Forgot</Text>
                <Text style={styles.headingText}>Password?</Text>
            </View>

            <Text style={styles.descriptionText}>
                {otpSent
                    ? "Enter the OTP sent to your phone number."
                    : "Enter your phone number and we will send an OTP to reset your password."}
            </Text>

            <View style={styles.innerContainer}>
                {!otpSent ? (
                    <>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                style={styles.input}
                                placeholderTextColor="#FFFFFF"
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.sendOTPButton}>
                            <Text style={styles.sendOTPText}>
                                Send OTP
                            </Text>
                            <TouchableOpacity onPress={handleSendOTP} style={styles.arrowButton}>
                                <View style={styles.circle}>
                                    <AntDesign name="arrowright" size={24} color="white" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <Animated.View
                            style={[
                                styles.otpContainer,
                                { transform: [{ translateX: shakeAnimation }] },
                            ]}
                        >
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    style={[
                                        styles.otpInput,
                                        isShaking && styles.shakingInput
                                    ]}
                                    maxLength={1}
                                    keyboardType="numeric"
                                    value={digit}
                                    onChangeText={(text) => handleOtpChange(text, index)}
                                    ref={(input: any) => (otpInputs.current[index] = input)}
                                />
                            ))}
                        </Animated.View>

                        <TouchableOpacity onPress={handleVerifyOTP} style={styles.verifyButton}>
                            <Text style={styles.verifyButtonText}>Verify OTP</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: StatusBar.currentHeight || 0,
        padding: 20,
    },
    innerContainer: {
        alignItems: "center",
        width: "100%",
        flex: 1,
        marginTop: 100,
    },
    headingText: {
        color: "#10354B",
        fontSize: 32,
        fontWeight: '600',
    },
    wave_image: {
        width: "110%",
        position: "absolute",
        height: 300,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: "#86D0FB",
        borderRadius: 20,
        padding: 10,
        width: "100%",
        backgroundColor: "#86D0FB",
        color: "#FFFFFF",
        paddingHorizontal: 20,
    },
    sendOTPButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        justifyContent: "space-around",
        width: "100%",
    },
    arrowButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#2AA4D5",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#2AA4D5",
    },
    marginTop150: {
        marginTop: 150,
    },
    descriptionText: {
        color: Colors.primary,
        paddingRight: 10,
        marginTop: 40,
    },
    sendOTPText: {
        color: Colors.primary,
        fontSize: 24,
        fontWeight: '700',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 30,
    },
    otpInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 24,
    },
    shakingInput: {
        borderColor: '#f23535',
        color: '#f23535',
    },
    verifyButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default ForgotPasswordScreen;