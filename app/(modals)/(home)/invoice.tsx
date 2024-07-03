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
        <div class="row"><span class="label">Vehicle Number:</span><span>${invoiceData.vehicle?invoiceData.vehicle.number:""}</span></div>
        <div class="row"><span class="label">Destination Place:</span><span>${invoiceData.destinationPlace}</span></div>
        <div class="row"><span class="label">Rate per KM:</span><span>${invoiceData.perKmRateInINR}</span></div>
        <div class="row"><span class="label">Advance Payment:</span><span>${invoiceData.advanceAmountInINR}</span></div>
        <div class="row"><span class="label">Pending Payment:</span><span>${invoiceData.remainingAmountInINR}</span></div>
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
      {invoiceData.vehicle && 
      <View style={styles.row}>
        <Text style={styles.label}>Vehicle Number:</Text>
        <Text style={styles.value}>{invoiceData.vehicle.number}</Text>
      </View>
      }
      <View style={styles.row}>
        <Text style={styles.label}>Destination Place:</Text>
        <Text style={styles.value}>{invoiceData.destinationPlace}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Rate per KM:</Text>
        <Text style={styles.value}>{invoiceData.perKmRateInINR}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Advance Payment:</Text>
        <Text style={styles.value}>{invoiceData.advanceAmountInINR}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Pending Payment:</Text>
        <Text style={styles.value}>{invoiceData.remainingAmountInINR}</Text>
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