import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Colors } from "@/constants/Colors";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const InvoiceScreen: React.FC = () => {
  const { invoiceData } = useGlobalContext();

  const createAndDownloadPDF = async () => {
    if (!invoiceData) return;

    const htmlContent = `
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <style>
        body { font-family: 'Helvetica'; padding: 20px; }
        .title { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .label { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="title">Invoice</div>
      <div class="row"><span class="label">Invoice ID:</span><span>${invoiceData._id}</span></div>
      <div class="row"><span class="label">Customer Name:</span><span>${invoiceData.customerName}</span></div>
      <div class="row"><span class="label">Mobile Number:</span><span>${invoiceData.mobileNumber}</span></div>
      <div class="row"><span class="label">Alternate Number:</span><span>${invoiceData.alternateNumber}</span></div>
      <div class="row"><span class="label">Vehicle Number:</span><span>${invoiceData.vehicle ? invoiceData.vehicle.number : ""}</span></div>
      <div class="row"><span class="label">Other Vehicle Number:</span><span>${invoiceData.otherVehicle ? invoiceData.otherVehicle.number : ""}</span></div>
      <div class="row"><span class="label">KM Starting:</span><span>${invoiceData.kmStarting}</span></div>
      <div class="row"><span class="label">Rate per KM:</span><span>${invoiceData.perKmRateInINR}</span></div>
      <div class="row"><span class="label">Advance Amount:</span><span>${invoiceData.advanceAmountInINR}</span></div>
      <div class="row"><span class="label">Remaining Amount:</span><span>${invoiceData.remainingAmountInINR}</span></div>
      <div class="row"><span class="label">Advance Place:</span><span>${invoiceData.advancePlace}</span></div>
      <div class="row"><span class="label">Departure Place:</span><span>${invoiceData.departurePlace}</span></div>
      <div class="row"><span class="label">Destination Place:</span><span>${invoiceData.destinationPlace}</span></div>
      <div class="row"><span class="label">Departure Time:</span><span>${invoiceData.departureTime}</span></div>
      <div class="row"><span class="label">Return Time:</span><span>${invoiceData.returnTime}</span></div>
      <div class="row"><span class="label">Toll:</span><span>${invoiceData.tollInINR}</span></div>
      <div class="row"><span class="label">Other State Tax:</span><span>${invoiceData.otherStateTaxInINR}</span></div>
      <div class="row"><span class="label">Note:</span><span>${invoiceData.note}</span></div>
      <div class="row"><span class="label">Instructions:</span><span>${invoiceData.instructions}</span></div>
      <div class="row"><span class="label">Created At:</span><span>${invoiceData.createdAt}</span></div>
      <div class="row"><span class="label">Updated At:</span><span>${invoiceData.updatedAt}</span></div>
      <div class="row"><span class="label">Status:</span><span>${invoiceData.status}</span></div>
      <div class="row"><span class="label">Departure Date:</span><span>${invoiceData.departureDate}</span></div>
      <div class="row"><span class="label">Return Date:</span><span>${invoiceData.returnDate}</span></div>
    </body>
    </html>
  `;


    try {
      console.log('Generating PDF...');
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (!uri) {
        throw new Error('Failed to generate PDF');
      }
      console.log('PDF generated at:', uri);

      const pdfName = `Invoice_${invoiceData._id}.pdf`;
      const pdfDir = `${FileSystem.documentDirectory}PDFs/`;
      const pdfUri = `${pdfDir}${pdfName}`;

      console.log('Creating directory...');
      await FileSystem.makeDirectoryAsync(pdfDir, { intermediates: true });

      console.log('Copying file...');
      await FileSystem.copyAsync({
        from: uri,
        to: pdfUri
      });

      console.log('File saved at:', pdfUri);

      Alert.alert(
        "PDF Saved",
        `The invoice has been saved as ${pdfName} in your app's documents folder.`,
        [
          { text: "OK" },
          {
            text: "Share",
            onPress: () => sharePDF(pdfUri)
          }
        ]
      );
    } catch (error) {
      console.error('Error in createAndDownloadPDF:', error);
      Alert.alert("Error", "Failed to generate or save PDF");
    }
  };

  const sharePDF = async (fileUri: string) => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing isn't available on your platform");
        return;
      }
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Error in sharePDF:', error);
      Alert.alert("Error", "Failed to share PDF");
    }
  };

  if (!invoiceData) {
    return (
      <View style={styles.centered}>
        <Text>No invoice found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Invoice</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Invoice ID:</Text>
        <Text style={styles.value}>{invoiceData._id}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Customer Name:</Text>
        <Text style={styles.value}>{invoiceData.customerName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Mobile Number:</Text>
        <Text style={styles.value}>{invoiceData.mobileNumber}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Alternate Number:</Text>
        <Text style={styles.value}>{invoiceData.alternateNumber}</Text>
      </View>
      {invoiceData.vehicle &&
        <View style={styles.row}>
          <Text style={styles.label}>Vehicle Number:</Text>
          <Text style={styles.value}>{invoiceData.vehicle.number}</Text>
        </View>
      }
      {invoiceData.otherVehicle &&
        <View style={styles.row}>
          <Text style={styles.label}>Other Vehicle Number:</Text>
          <Text style={styles.value}>{invoiceData.otherVehicle.number}</Text>
        </View>
      }
      <View style={styles.row}>
        <Text style={styles.label}>KM Starting:</Text>
        <Text style={styles.value}>{invoiceData.kmStarting}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Rate per KM:</Text>
        <Text style={styles.value}>{invoiceData.perKmRateInINR}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Advance Amount:</Text>
        <Text style={styles.value}>{invoiceData.advanceAmountInINR}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Remaining Amount:</Text>
        <Text style={styles.value}>{invoiceData.remainingAmountInINR}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Advance Place:</Text>
        <Text style={styles.value}>{invoiceData.advancePlace}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Departure Place:</Text>
        <Text style={styles.value}>{invoiceData.departurePlace}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Destination Place:</Text>
        <Text style={styles.value}>{invoiceData.destinationPlace}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Departure Time:</Text>
        <Text style={styles.value}>{invoiceData.departureTime}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Return Time:</Text>
        <Text style={styles.value}>{invoiceData.returnTime}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Toll:</Text>
        <Text style={styles.value}>{invoiceData.tollInINR}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Other State Tax:</Text>
        <Text style={styles.value}>{invoiceData.otherStateTaxInINR}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Note:</Text>
        <Text style={styles.value}>{invoiceData.note}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Instructions:</Text>
        <Text style={styles.value}>{invoiceData.instructions}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Created At:</Text>
        <Text style={styles.value}>{invoiceData.createdAt}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Updated At:</Text>
        <Text style={styles.value}>{invoiceData.updatedAt}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{invoiceData.status}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Departure Date:</Text>
        <Text style={styles.value}>{invoiceData.departureDate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Return Date:</Text>
        <Text style={styles.value}>{invoiceData.returnDate}</Text>
      </View>
      <TouchableOpacity style={styles.downloadButton} onPress={createAndDownloadPDF}>
        <Text style={styles.downloadButtonText}>Download PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.darkBlue,
  },
  value: {
    fontSize: 16,
    color: Colors.secondary,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InvoiceScreen;