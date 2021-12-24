import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
//import Products from '../asset/products.ts';
import ProductScreen from '../screen/product.tsx';
import {useNavigation } from '@react-navigation/native';
import {DataStore} from 'aws-amplify';
import {Product} from '../src/models';

const renderItem = ({item}, navigation) =>{
const viewProduct = () =>{
    navigation.navigate('ProductScreen', {ProductID: item.id})
}
return(
    <TouchableOpacity onPress = {viewProduct}>
    <View style = {styles.resultRow}>
        <Text>{item.title}</Text>
    </View>
    </TouchableOpacity>
    )
}

export const Search = () =>{

//Because of the fact that Search function is not within any Navigation tag, useNavigation has to be used in this case
const navi = useNavigation();
const [query, setQuery] = useState('')
const [displayList, setDisplay] = useState(false)
const [searchResults, setResults] = useState([])
const handleQuery = val =>{
    setQuery(val)
}
const [product, setProduct] = useState<Product[]>([]);

const fetchProduct = async () =>{
    const productList = await DataStore.query(Product).then(setProduct)
}

//use the filter method to create a new array of values that corresponds with what the user is searching for
//Do a deep copy of the array using the map method
//make sure to covert both the titles in the array and the search query to both lower case
const filterData = () =>{
if(product){
   let newArray = product.filter(val => val.title.toLowerCase().search(query.toLowerCase()) > -1 );
   setResults(newArray.map(val => val));
}
}

useEffect(()=>{
    fetchProduct();
    filterData();
    if(searchResults.length > 0 && query.length > 0){
        setDisplay(true)
    }
    else{
        setDisplay(false)
    }
}, [query])

return(
<View style = {styles.container}>
    <View style = {styles.searchField}>
    <Icon name = 'search' size  = {25} color = '#000' style = {styles.magnifyIcon}/>
    <TextInput
        placeholder = 'Search'
        value = {query}
        onChangeText = {handleQuery}
        style = {styles.textInput}
    />
    </View>
    { displayList ?
        <View>
        <FlatList
            data = {searchResults}
            renderItem = {(item) => renderItem(item, navi)}
            style = {styles.searchResults}
        />
        </View>
        :
        <View></View>
    }

</View>

)
}

const winWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
container: {

},

magnifyIcon:{
    justifyContent: 'flex-end',
    marginLeft: 5,
    paddingVertical: 10,
},
resultRow: {
    marginVertical: 10,
    marginHorizontal: 10,
},
searchField:{
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: winWidth * 0.85,
    marginVertical: 10,
    height: 45,
},
searchResults:{

},
textInput:{
    paddingVertical: 10,
    width: '100%',
    paddingLeft: 5,

},
})