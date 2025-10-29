import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { color } from '../../common/color';
import { font } from '../../common/Font';
import GetAPI from '../../api/GetAPI';
import priceFormat from '../../utils/priceFormat';
import CalculatePercentage from '../../utils/CalculatePercentage';
import Loader from '../Loader/Loader';

const StockDetailsMarketModal = ({ isVisible, onClose, data, onBuy, onSell }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);

  const symbol = data?.symbol;

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await GetAPI.getOneStockData({ data: symbol });
        setStockData(response?.meta);
      } catch (error) {
        setStockData(null);
        // console.log('Error fetching stock details:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [symbol]);

  if (!isVisible || !symbol) return null;

  const getPercent = () => {
    if (!stockData) return '0.00';
    return stockData?.changePercent
      ? stockData?.changePercent.toFixed(2)
      : CalculatePercentage({
          initialValue: stockData?.previousClose,
          finalValue: stockData?.regularMarketPrice,
        });
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          {loading ? (
            <Loader loading={true} />
          ) : stockData ? (
            <>
              <Text style={styles.symbol}>{stockData.symbol}</Text>
              <Text style={styles.price}>₹{priceFormat(stockData.regularMarketPrice)}</Text>
              <Text
                style={[
                  styles.percentage,
                  {
                    color:
                      parseFloat(getPercent()) < 0
                        ? color.color_red
                        : color.color_green,
                  },
                ]}
              >
                ({getPercent()}%)
              </Text>

              {/* Add market depth info here if needed */}
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.buyButton} onPress={onBuy}>
                  <Text style={styles.buttonText}>BUY</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sellButton} onPress={onSell}>
                  <Text style={styles.buttonText}>SELL</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={{ color: '#ccc' }}>Close</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.errorText}>Failed to load stock info</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default StockDetailsMarketModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    width: '90%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  symbol: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  price: {
    fontSize: 22,
    color: '#fff',
    marginTop: 5,
  },
  percentage: {
    fontSize: 16,
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  buyButton: {
    backgroundColor: color.color_darkblue,
    padding: 10,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  sellButton: {
    backgroundColor: color.color_red,
    padding: 10,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
  },
  errorText: {
    color: '#ccc',
  },
});
