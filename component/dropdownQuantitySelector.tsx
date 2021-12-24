import React, {useEffect, useState} from 'react'
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";
import {View, StyleSheet, Text, TextInput, Image } from 'react-native';

const Selector = ({quantity, setQuantity}) =>{

const handleSelection = val => {
    setQuantity(val)
}

return(
    <View style = {styles.container}>
     <MenuProvider style={{ flexDirection: "column", padding: 30 }}>
            <Menu onSelect={value => handleSelection(value)}>

              <MenuTrigger  >
              <Text style={styles.headerText}>DropDown Menu</Text>
              </MenuTrigger  >

              <MenuOptions>
                <MenuOption value={0}>
                  <Text style={styles.menuContent}>0 [delete]</Text>
                </MenuOption>
                <MenuOption value={1}>
                  <Text style={styles.menuContent}>1</Text>
                </MenuOption>
                <MenuOption value={2}>
                  <Text style={styles.menuContent}>2</Text>
                </MenuOption>
                <MenuOption value={3}>
                  <Text style={styles.menuContent}>3</Text>
                </MenuOption>
                <MenuOption value={4}>
                  <Text style={styles.menuContent}>4</Text>
                </MenuOption>
                <MenuOption value={5}>
                  <Text style={styles.menuContent}>5</Text>
                </MenuOption>
                <MenuOption value={6}>
                  <Text style={styles.menuContent}>6</Text>
                </MenuOption>
                <MenuOption value={7}>
                  <Text style={styles.menuContent}>7</Text>
                </MenuOption>
                <MenuOption value={8}>
                  <Text style={styles.menuContent}>8</Text>
                </MenuOption>
                <MenuOption value={9}>
                  <Text style={styles.menuContent}>9</Text>
                </MenuOption>
                <MenuOption value={10}>
                  <Text style={styles.menuContent}>10+</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </MenuProvider>
    </View>
)
}

export default Selector;

const styles = StyleSheet.create({
container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
},
headerText: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold",
},
menuContent: {
    color: "#000",
    fontWeight: "bold",
    padding: 2,
    fontSize: 20,
}
})