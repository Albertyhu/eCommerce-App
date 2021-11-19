import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Text, TextInput, Image, FlatList, Dimensions } from 'react-native';

const winWidth = Dimensions.get('window').width;

const generateKey = () =>{
    return `${Math.random() * 100000 - 1}`
}

const renderItem = ({item}) =>{
    return(
       <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', width: winWidth}}>
        <Image
            style = {styles.image}
            source = {{uri: item}}
        />
       </View>
    )
}

const Carousel = ({data}) =>{
const [dots, setDots] = useState([])
const [active, setActiveIndex] = useState(0)

//FlatList will throw an error every time there is a change in code
//useCallback is used to store the following function in memory
const handleChangedItems = useCallback(({viewableItems}) =>{
if(viewableItems.length > 0){
    setActiveIndex(viewableItems[0].index || 0)
  //  console.log(viewableItems)
    }
}, []);

useEffect(()=>{
}, [])

return(
    <View style = {styles.container}>
        <FlatList
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            data = {data}
            renderItem = {renderItem}
            horizontal = {true}
            keyExtractor={(item, index) => index.toString()}
            snapToInterval = {winWidth - 20}
            snapToAlignment = {'center'}
            showsHorizontalScrollIndicator = {false}
            decelerationRate = {'fast'}
            viewabilityConfig = {{viewAreaCoveragePercentThreshold: 50,
            minimumViewTime: 300
            }}
            //this prop returns an array containing information about the FlatList item that is currently in view.
            onViewableItemsChanged = {handleChangedItems}
        />
    <View style = {styles.dotContainer}>
        {data &&
            data.map((val, index) =>(
                <View style = {[styles.dot,
                    {backgroundColor: index === active ? '#a1a1a1' : '#d5d5d5'}
                ]} key = {val}></View>
            ))
        }
    </View>
    </View>
)
}

export default Carousel ;

const styles = StyleSheet.create({
carousel:{
    alignItems: 'center',
},
container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
},
dot:{
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: '#d5d5d5',
    marginHorizontal: 10,
},
dotContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
},
image: {
    height: 250,
    resizeMode: 'contain',
    margin: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',

},
})