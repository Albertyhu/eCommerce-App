import React from 'react';
import {View, StyleSheet, Text, TextInput, Image } from 'react-native';

import {Search} from '../component/searchComponent.tsx';

const SearchScreen = () =>{
return(
    <View style = {styles.container}>
        <Search />
    </View>
)
}

export default SearchScreen;

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: 'center',
},
})