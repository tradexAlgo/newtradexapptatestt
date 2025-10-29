import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Fuse from 'fuse.js';

const SearchableDataList = ({ apiUrl, searchKey, displayFields, onItemSelect,searchQueryI }) => {
  const [data, setData] = useState({});
  const [searchQuery, setSearchQuery] = useState(searchQueryI || '');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios.get(apiUrl)
      .then(response => {

        const filteredData = Object.keys(response.data)
          .filter(key => key.endsWith("FUT"))
          .reduce((obj, key) => {
            obj[key] = response.data[key];
            return obj;
          }, {});

        setData(filteredData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [apiUrl]);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredData([]);
      return;
    }

    const dataArray = Object.values(data);

    const fuseOptions = {
      keys: [searchKey],
      threshold: 0.3,
    };

    const fuse = new Fuse(dataArray, fuseOptions);
    const results = fuse.search(searchQuery);
    setFilteredData(results.map(result => result.item).slice(0, 20)); // Limit to 10 items
  }, [searchQuery, data, searchKey]);

  const handleItemSelect = (item) => {
    onItemSelect(item);
    setSearchQuery('');
    setFilteredData([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={`Search to start`}
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        style={styles.searchInput}
        placeholderTextColor="white"
      />
      {filteredData.length > 0 && (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.symTicker}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemSelect(item)}>
              <View style={styles.listItem}>
                <Text style={styles.symbolText}>{item.symTicker}</Text>
                <View style={styles.descriptionContainer}>
                  {displayFields.map((field, index) => (
                    <Text key={index} style={styles.descriptionText}>
                      {field.label}: <Text style={styles.highlight}>{field.format ? field.format(item[field.key]) : item[field.key]}</Text>
                    </Text>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      {filteredData.length === 0 && searchQuery !== '' && (
        <Text>No results found for "{searchQuery}".</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    paddingHorizontal: 20
  },
 searchInput: {
  backgroundColor: '#1e1e1e',     // Slightly lighter than black
  borderWidth: 1,
  borderColor: '#333',            // Soft border contrast
  borderRadius: 12,
  padding: 10,
  color: 'white',
  fontSize: 16,
  marginBottom: 20,

  // iOS shadow for subtle depth
  shadowColor: '#ffffff20',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,

  // Android elevation
  elevation: 2,
},
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  symbolText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  descriptionContainer: {
    justifyContent: 'space-between',
  },
  descriptionText: {
    fontSize: 14,
    color: 'white',
  },
  highlight: {
    color: '#007bff', // Blue color for highlighting
  },
});

export default SearchableDataList;
