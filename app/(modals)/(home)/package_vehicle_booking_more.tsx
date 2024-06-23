import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors'; // Ensure to import your color constants

const VehicleDetailsScreen: React.FC = () => {
  const vehicleDetails = {
    vehicleNumber: 'ABC123',
    otherVehicleNumber: 'XYZ456',
    customerName: 'John Doe',
    mobileNumber: '1234567890',
    alternateNumber: '9876543210',
    kmStarting: '1000',
    perKmRate: '10',
    advancedAmount: '5000',
    remainingAmount: '2000',
    departurePlace: 'City A',
    destinationPlace: 'City B',
    departureTime: '10:00 AM',
    returnTime: '5:00 PM',
    toll: '200',
    otherStateTax: '100',
    instructions: 'Handle with care',
    addNote: 'Please note additional instructions',
    entryParking: 'Paid parking available'
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Vehicle Number:</Text>
        <Text style={styles.value}>{vehicleDetails.vehicleNumber}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Other Vehicle Number:</Text>
        <Text style={styles.value}>{vehicleDetails.otherVehicleNumber}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Customer Name:</Text>
        <Text style={styles.value}>{vehicleDetails.customerName}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Mobile Number:</Text>
        <Text style={styles.value}>{vehicleDetails.mobileNumber}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Alternate Number/ WhatsApp Number:</Text>
        <Text style={styles.value}>{vehicleDetails.alternateNumber}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Km Starting:</Text>
        <Text style={styles.value}>{vehicleDetails.kmStarting}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Per Km Rate:</Text>
        <Text style={styles.value}>{vehicleDetails.perKmRate}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Advanced Amount:</Text>
        <Text style={styles.value}>{vehicleDetails.advancedAmount}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Remaining Amount:</Text>
        <Text style={styles.value}>{vehicleDetails.remainingAmount}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Departure Place:</Text>
        <Text style={styles.value}>{vehicleDetails.departurePlace}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Destination Place:</Text>
        <Text style={styles.value}>{vehicleDetails.destinationPlace}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Departure Time:</Text>
        <Text style={styles.value}>{vehicleDetails.departureTime}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Return Time:</Text>
        <Text style={styles.value}>{vehicleDetails.returnTime}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Toll:</Text>
        <Text style={styles.value}>{vehicleDetails.toll}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Other State Tax:</Text>
        <Text style={styles.value}>{vehicleDetails.otherStateTax}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Instructions:</Text>
        <Text style={styles.value}>{vehicleDetails.instructions}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Add Note:</Text>
        <Text style={styles.value}>{vehicleDetails.addNote}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Entry/Parking:</Text>
        <Text style={styles.value}>{vehicleDetails.entryParking}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 10,
  },
  label: {
    color: Colors.secondary,
    fontWeight: 'semibold',
    fontSize: 13,
  },
  value: {
    fontSize: 13,
    marginBottom: 4,
  },
});

export default VehicleDetailsScreen;
