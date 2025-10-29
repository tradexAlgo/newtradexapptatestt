import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import { color } from '../../common/color';

const DisplayShowDetails = memo(({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const displayedDataRef = useRef(data);

  const labels = {
    ask: 'Ask Price',
    bid: 'Bid Price',
    ch: 'Change Amount',
    chp: 'Change Percentage',
    description: 'Description',
    exchange: 'Exchange',
    fyToken: 'Futures Token',
    high_price: 'High Price',
    low_price: 'Low Price',
    lp: 'Live Price',
    open_price: 'Opening Price',
    original_name: 'Original Name',
    prev_close_price: 'Previous Close Price',
    short_name: 'Short Name',
    spread: 'Spread',
    symbol: 'Symbol',
    tt: 'Timestamp',
    volume: 'Volume',
  };

  const toggleExpand = useCallback(() => setExpanded(prev => !prev), []);

  useEffect(() => {
    if (!expanded) {
      displayedDataRef.current = data;
    }
  }, [expanded, data]);

  return (
    <ScrollView style={sty.container} showsHorizontalScrollIndicator={false}>
      <TouchableOpacity onPress={toggleExpand} style={sty.header}>
        <Text style={sty.headerText}>{expanded ? 'Hide Overview' : 'Show Overview'}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={sty.scrollWrapper}>
          <ScrollView horizontal style={sty.detailsContainer} showsHorizontalScrollIndicator={false}>
            <View style={sty.grid}>
              {Object.entries(displayedDataRef.current).map(([key, value]) => (
                <View key={key} style={sty.detailCard}>
                  <Text style={sty.label}>{labels[key] || key}:</Text>
                  <Text style={sty.value}>{value}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={sty.gradientOverlay} />
        </View>
      )}
    </ScrollView>
  );
});

const { width } = Dimensions.get('window');
const cardWidth = (width - 20) / 2; // Adjusted for less padding

const sty = StyleSheet.create({
  container: {
    padding: 5, // Reduced padding
    backgroundColor: 'black',
  },
  header: {
    padding: 8, // Reduced padding
    backgroundColor: color.color_notification,
    borderRadius: 12,
    marginBottom: 8, // Reduced margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  headerText: {
    fontSize: 14, // Slightly smaller font size
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scrollWrapper: {
    position: 'relative',
  },
  detailsContainer: {
    flexDirection: 'row',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width * 2.5, // Adjusted for horizontal scroll
  },
  detailCard: {
    width: cardWidth,
    padding: 6, // Reduced padding
    margin: 4, // Reduced margin
    backgroundColor: '#1e1e1e',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: color.color_white,
  },
  value: {
    fontSize: 12,
  color: color.color_white,
  },
  gradientOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 30,
    // backgroundColor: 'linear-gradient(to left, rgba(0,0,0,0.1), rgba(0,0,0,0))',
  },
});

export default DisplayShowDetails;
