/**
 * @file    App.js
 * @author  Claire Fleckney
 * @date    March 27, 2023
 * @brief   This is the main file for controlling the
 *          page flow of the app
 */

import * as SplashScreen from 'expo-splash-screen';
import * as SQLite from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { Component } from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import styles from './Style';
import Menu from './Menu';
import Dungeon from './Dungeon';
import Fight from './Fight';

const Stack = createNativeStackNavigator();

/**
 * Creates/Opens the database
 * TODO Add warning/error checking for web platform
 * @function openDatabase()
 * @returns database object
 */
function openDatabase() {
  const db = SQLite.openDatabase('dungeonescape.db');
  return db;
}

const db = openDatabase(); // Container variable container for the opened SQLite database object

// Stack of Screens and database setup
export default class App extends Component {

  // Create the tables in the database if they do not already exist
  componentDidMount() {
    db.transaction(
      (tx) => {
        tx.executeSql(
          // Drop the jobstats table if it exists
          'drop table if exists jobstats;',
          [],
          null,
          (err) => console.log('drop >>>>> ', err)
        );
        tx.executeSql(
          // Create the jobstats table
          'create table jobstats (id integer primary key not null, job text, hp int, attack int, defense int);',
          [],
          null,
          (err) => console.log('create >>>>> ', err)
        );
        tx.executeSql(
          // Insert jobs into the jobstats table
          'insert into jobstats (job, hp, attack, defense) values (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?);',
          ['Warrior',50,10,20,'Mage',50,20,10,'Ranger',50,15,15,'Ninja',50,15,20],
          null,
          (err) => console.log('insert >>>>> ', err)
        );
        tx.executeSql(
          // Create the player table if it doesn't exist
          'create table if not exists player (id integer primary key not null, name text, job text, victory boolean);',
          [],
          null,
          (err) => console.log('player >>>>> ', err)
        );
      },
    );
  }

  render() {
    // Keep the splash screen visible while we fetch resources
    SplashScreen.preventAutoHideAsync();
    setTimeout(SplashScreen.hideAsync, 5000);
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Menu Screen"
            component={MenuScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Dungeon"
            component={DungeonScreen}
            options={{ headerShown: false,
            orientation: 'landscape'}}
          />
          <Stack.Screen name="FightScreen"
            component={FightScreen}
            options={{ headerShown: false,
            orientation: 'landscape' }}
          />
          <Stack.Screen name="VictoryScreen"
            component={VictoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Game Over"
            component={GameOverScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };
}

// The landing page
const MenuScreen = ({navigation}) => {

  return (
    <Menu navigation={navigation} db={db} />
  )
};

// The Dungeon screen
const DungeonScreen = ({navigation, route}) => {
  let job = route.params.job;
  let name = route.params.name;
  return (
    <Dungeon job={job} name={name} navigation={navigation} db={db} />
  )
};

// The Fight Screen
const FightScreen = ({navigation, route}) => {

  const bg = require('./assets/sprites/dungeon-tiles/fight.png');

  let job = route.params.job;
  let name = route.params.name;
  let hp = route.params.hp;
  let attack = route.params.attack;
  let defense = route.params.defense;

  return (
    <ImageBackground source={bg} resizeMode='contain' style={styles.fightScreen}>
      <Fight job={job} name={name} hp={hp} attack={attack} defense={defense} navigation={navigation} db={db}/>
    </ImageBackground>
  )
};

// The Victory Screen
const VictoryScreen = ({navigation, route}) => {
  return (
    <View style={[{justifyContent:'center', alignItems: 'center'},styles.container]}>
      <Text style={styles.gameOver}>Victory!</Text>
      <Pressable style={({pressed}) =>
          [{borderBottomWidth: pressed ? 0 : 5,
              borderRightWidth: pressed ? 0 : 5,},
              styles.landingBtn
          ]}
          onPress={() => navigation.navigate('Menu Screen')}
      >
          <Text style={styles.landingBtnTxt}>Back to Main Screen</Text>
      </Pressable>
    </View>
  )
};

// The Game Over Screen
const GameOverScreen = ({navigation, route}) => {
  return (
    <View style={[{justifyContent:'center', alignItems: 'center'},styles.container]}>
      <Text style={styles.gameOver}>Game Over</Text>
      <Pressable style={({pressed}) =>
          [{borderBottomWidth: pressed ? 0 : 5,
              borderRightWidth: pressed ? 0 : 5,},
              styles.backBtn
          ]}
          onPress={() => navigation.navigate('Menu Screen')}
      >
          <Text style={styles.landingBtnTxt}>Back to Main Screen</Text>
      </Pressable>
    </View>
  )
};
