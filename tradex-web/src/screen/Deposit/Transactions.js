import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { getRequest } from '../../utils/baseURL';
import { color } from '../../common/color';
import Appheader from '../../component/AppHeader/appheader';
import { useNavigation } from '@react-navigation/native';

const Transactions = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchTransactions = async () => {
    try {
      const response = await getRequest('/user/getUserTransactions');
      if (response?.status) {
        setTransactions(response.data);
      }
    } catch (err) {
      // console.log('Transaction fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handlePressItem = (item) => {
    setSelectedTransaction(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePressItem(item)} style={styles.card}>
      <Text style={styles.amount}>
        ₹ {item.amount.toFixed(2)} ({item.type})
      </Text>
      <Text style={styles.status}>
        {item.status} • {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );



  return (
    <View style={styles.container}>
      <Appheader onPress={() => navigation.goBack()} header="Your Transactions" />
      {loading ? (
        <ActivityIndicator color="white" size="large" />
      ) : transactions.length === 0 ? (
        <Text style={styles.noDataText}>No transactions available</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40, padding: 20 }}
        />
      )}

      {/* Modal for Transaction Details */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Transaction Details</Text>
            {selectedTransaction && (
              <>
                <Text style={styles.modalText}>Amount: ₹ {selectedTransaction.amount}</Text>
                <Text style={styles.modalText}>Type: {selectedTransaction.type}</Text>
                <Text style={styles.modalText}>Status: {selectedTransaction.status}</Text>
                <Text style={styles.modalText}>Currency: {selectedTransaction.currency}</Text>
                {selectedTransaction.upiId && (
                  <Text style={styles.modalText}>UPI ID: {selectedTransaction.upiId}</Text>
                )}
                {selectedTransaction.gateway && (
                  <Text style={styles.modalText}>Gateway: {selectedTransaction.gateway}</Text>
                )}
                {selectedTransaction.transactionId && (
                  <Text style={styles.modalText}>Txn ID: {selectedTransaction.transactionId}</Text>
                )}
                <Text style={styles.modalText}>
                  Date: {new Date(selectedTransaction.createdAt).toLocaleString()}
                </Text>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.color_black,
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  amount: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  status: {
    fontSize: 13,
    color: '#ccc',
  },
  noDataText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  modalContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 6,
  },
});
