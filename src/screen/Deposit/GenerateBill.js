import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    StyleSheet,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { color } from '../../common/color'; // adjust path
import { baseURLExport, getRequest } from '../../utils/baseURL';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Buffer } from 'buffer';
import StorageItems from '../../utils/StorageItems';
import Appheader from '../../component/AppHeader/appheader';
import { useNavigation } from '@react-navigation/native';

const GenerateBill = () => {
      const navigation = useNavigation();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState({ field: '', show: false });

    const handleDateChange = (event, selectedDate) => {
        setShowPicker({ field: '', show: false });
        if (showPicker.field === 'start') {
            setStartDate(selectedDate || startDate);
        } else if (showPicker.field === 'end') {
            setEndDate(selectedDate || endDate);
        }
    };

    const formatDate = date => {
        return date.toISOString().split('T')[0];
    };



    // const handleDownload = async () => {
    //   try {
    //     const payload = {
    //       startDate: formatDate(startDate),
    //       endDate: formatDate(endDate),
    //     };

    //     // Send API request to get file URL
    //     const response = await getRequest(`/market/exportStocksToExcel`, payload);

    //     if (!response?.url) {
    //       Alert.alert('Error', 'File URL not found.');
    //       return;
    //     }

    //     const fileUrl = response.url;
    //     const fileName = 'stock_report.xlsx';
    //     const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    //     // Download the file
    //     const downloadResult = await RNFS.downloadFile({
    //       fromUrl: fileUrl,
    //       toFile: downloadDest,
    //     }).promise;

    //     if (downloadResult.statusCode === 200) {
    //       // Share the file
    //       await Share.open({
    //         title: 'Share Excel Report',
    //         url: `file://${downloadDest}`,
    //         type:
    //           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //       });
    //     } else {
    //       Alert.alert('Error', 'Failed to download file.');
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     Alert.alert('Error', 'Something went wrong.');
    //   }
    // };

    const handleDownload = async () => {
        try {
            const token = StorageItems.getUserToken()
            const payload = {
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
            };
            const baseUrl = baseURLExport;
            const response = await fetch(`${baseUrl}/market/exportStocksToExcel`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                Alert.alert('Error', 'Download failed.');
                return;
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const filePath = `${RNFS.DocumentDirectoryPath}/stock_report.xlsx`;

            await RNFS.writeFile(filePath, buffer.toString('base64'), 'base64');

            await Share.open({
                title: 'Stock Report',
                url: `file://${filePath}`,
                type:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
        } catch (error) {
            console.error('Download Error:', error);
            Alert.alert('Error', 'Something went wrong while downloading.');
        }
    };


    return (
        <View style={styles.container}>
              <Appheader onPress={() => navigation.goBack()} header="Generate Stock Report" />

           <View style={{ padding: 20 }}>
             <View style={styles.dateRow}>
                <TouchableOpacity
                    style={styles.dateBox}
                    onPress={() => setShowPicker({ field: 'start', show: true })}
                >
                    <Text style={styles.dateText}>Start: {formatDate(startDate)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.dateBox}
                    onPress={() => setShowPicker({ field: 'end', show: true })}
                >
                    <Text style={styles.dateText}>End: {formatDate(endDate)}</Text>
                </TouchableOpacity>
            </View>

            {showPicker.show && (
                <DateTimePicker
                    value={
                        showPicker.field === 'start'
                            ? startDate
                            : showPicker.field === 'end'
                                ? endDate
                                : new Date()
                    }
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
                <Text style={styles.downloadText}>Download Excel</Text>
            </TouchableOpacity>
           </View>
        </View>
    );
};

export default GenerateBill;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.color_black,
        // justifyContent: 'center',
    },
    heading: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    dateBox: {
        padding: 15,
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        width: '48%',
    },
    dateText: {
        color: 'white',
        textAlign: 'center',
    },
    downloadButton: {
        backgroundColor: color.color_primary_green || '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    downloadText: {
        color: 'white',
        fontSize: 16,
    },
});
