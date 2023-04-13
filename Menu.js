/**
 * @file    Menu.js
 * @author  Claire Fleckney
 * @date    March 27, 2023
 * @brief   This is the file for controlling the
 *          page flow of the menu screens
 */

import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import React, { Component } from 'react';
import { Alert, Image, Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import styles from './Style';
import Stat from './Stats';

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            firstInst: true,
            idArray: [],
            id: undefined,
            name: '',
            job: 'Warrior',
            warBorder: 'green',
            mageBorder: '#303030',
            rangBorder: '#303030',
            ninBorder: '#303030',
            warrior: require('./assets/sprites/warrior/warrior-front.png'),
            mage: require('./assets/sprites/mage/mage-front.png'),
            ranger: require('./assets/sprites/ranger/ranger-front.png'),
            ninja: require('./assets/sprites/ninja/ninja-front.png'),
        }
    };

    async componentDidMount() {
        this.playBgMusic();
    };

    async componentWillUnmount() {
        const{ remoteSound } = this.state;
        if (remoteSound) {
            remoteSound.stopAsync();
            remoteSound.unloadAsync();
        }
    }

    /**
     * Plays the Menu background music
     * @function playBgMusic()
     */
    playBgMusic = async () => {
        const { sound } = await Audio.Sound.createAsync({
            uri: 'https://opengameart.org/sites/default/files/Exploring%20the%20Dungeon%20II_0.mp3',
        });
        this.setRemoteSound(sound);
        await sound.playAsync();
        sound.setIsLoopingAsync(true);
    }

    /**
     * Loads and sets the background music
     * @function setRemoteSound()
     * @param {Sound} newPbo Background music to play
     */
    setRemoteSound = (newPbo) => {
        this.setState({
            remoteSound: newPbo,
        });
    }

    /**
     * Dismisses the keyboard on screen press
     * @function dismissKeyboard()
     */
    dismissKeyboard = () => {
        Keyboard.dismiss();
    }

    /**
     * Sets the page number
     * @function setPage()
     * @param {int} p Page Number
     */
    setPage = (p) => {
        this.setState({ pageNum: p });
    }

    /**
     * Sets the players name
     * @function setName()
     * @param {string} userName User entered name
     */
    setName = (userName) => {
        let newName = userName;
        this.setState({
            name: newName,
        })
    }

    /**
     * Sets the players Job
     * @function setJob()
     * @param {string} j Player Job
     */
    setJob = (j) => { this.setState({ job: j });}

    /**
     * Sets the border color for the warrior icon
     * @function setWarBorder()
     * @param {string} b Color
     */
    setWarBorder = (b) => { this.setState({ warBorder: b });}

    /**
     * Sets the border color for the mage icon
     * @function setMageBorder()
     * @param {string} b Color
     */
    setMageBorder = (b) => { this.setState({ mageBorder: b });}

    /**
     * Sets the border color for the ranger icon
     * @function setRangBorder()
     * @param {string} b Color
     */
    setRangBorder = (b) => { this.setState({ rangBorder: b });}

    /**
     * Sets the border color for the ninja icon
     * @function setNinBorder()
     * @param {string} b Color
     */
    setNinBorder = (b) => { this.setState({ ninBorder: b });}

    /**
     * Navigates to the dungeon screen after player creation
     * @function startNav()
     * @param {int} page Page Number
     * @param {string} name Player Name
     * @param {string} job Player Job
     */
    startNav = (page, name, job, id) => {
        const { navigation } = this.props;
        page = page;
        name = name;
        job = job;
        id = id;
        // If the user hasn't set a name, send an alert
        if (name == '') {
        Alert.alert('Name Field Empty', 'Please choose a name for your character');
        } else {
            {navigation.navigate(page, {name: name, job: job, id: id});};
        }
    };

    /**
     * Changes which set of instructions is showing
     * @function changeInst()
     */
    changeInst = () => {
        this.setState({ firstInst: !this.state.firstInst });
    }

    render() {
        let inst1 = 'Give your character a name and choose from one of four starting Jobs\n\nMake your way through the maze using the directional buttons\n\nTry to make it to the prize at the end!';
        let inst2 = 'When Kobolds appear, swipe right to attack, swipe left to defend, and shake your device to activate your special abilities!\n\nYou can view your past progress on the Stats Screen';
        let titlelogo = require('./assets/titlelogo.png');
        const { db } = this.props;
        if (this.state.pageNum === 1) { // Main Landing Page
            return (
                <View style={styles.container}>
                    <View style={styles.topContainer}>
                        <StatusBar style='light' />
                        <Image source={titlelogo} style={styles.titleLogo} />
                    </View>
                    <View style={styles.bottomContainer}>
                        <Pressable style={({pressed}) =>
                        [{borderBottomWidth: pressed ? 0 : 5,
                            borderRightWidth: pressed ? 0 : 5,},
                            styles.landingBtn
                        ]}
                        onPress={() => {this.setPage(3)}}
                        >
                        <Text style={styles.landingBtnTxt}>Start New Game</Text>
                        </Pressable>
                    </View>
                    <View style={styles.bottomContainer}>
                        <Pressable style={({pressed}) =>
                        [{borderBottomWidth: pressed ? 0 : 5,
                            borderRightWidth: pressed ? 0 : 5,},
                            styles.landingBtn
                        ]}
                        onPress={() => {this.setPage(2)}}
                        >
                        <Text style={styles.landingBtnTxt}>View Instructions</Text>
                        </Pressable>
                    </View>
                    <View style={styles.bottomContainer}>
                        <Pressable style={({pressed}) =>
                        [{borderBottomWidth: pressed ? 0 : 5,
                            borderRightWidth: pressed ? 0 : 5,},
                            styles.landingBtn
                        ]}
                        onPress={() => {this.setPage(4)}}
                        >
                            <Text style={styles.landingBtnTxt}>View Past Stats</Text>
                        </Pressable>
                    </View>
                </View>
            )
        } else if (this.state.pageNum === 2) { // Instructions Page
            return (
                <>
                <View style={styles.instPage}>
                    <Pressable 
                        style={({pressed}) => [{opacity: pressed? .25 : 1}, {transform: [{ rotate: '-90deg'}]}, styles.instButton]}
                        onPress={() => {this.changeInst()}}
                    />
                    <View style={styles.instructions}>
                        {this.state.firstInst ? 
                            <Text style={styles.instText}>{inst1}</Text> :
                            <Text style={styles.instText}>{inst2}</Text> 
                        }
                    </View>
                    <Pressable
                        style={({pressed}) => [{opacity: pressed? .25 : 1}, {transform: [{ rotate: '90deg'}]}, styles.instButton]}
                        onPress={() => {this.changeInst()}}
                    />
                </View>
                <View style={styles.instReturn}>
                    <Pressable style={({pressed}) =>
                    [{borderBottomWidth: pressed ? 0 : 5,
                        borderRightWidth: pressed ? 0 : 5,},
                        styles.landingBtn
                    ]}
                    onPress={() => {this.setPage(1)}}
                    >
                        <Text style={styles.landingBtnTxt}>Return to Main Screen</Text>
                    </Pressable>
                </View>
                </>
            )
        } else if (this.state.pageNum === 3) { // Character Creation Page
            return (
                <Pressable style={styles.container} onPress={() => {this.dismissKeyboard}}>
                    <View style={styles.header}>
                        <TextInput
                            style={styles.nameInput}
                            onChangeText={this.setName}
                            value={this.state.name}
                            placeholder='Character Name'
                        />
                    </View>
                    <View style={styles.job}>
                        <Pressable style={[{borderColor: this.state.warBorder}, styles.jobSelect]}
                        onPress={() => {this.setJob('Warrior'),
                            this.setWarBorder('green'),
                            this.setMageBorder('#303030'),
                            this.setRangBorder('#303030'),
                            this.setNinBorder('#303030')}}
                        >
                            <Image source={this.state.warrior} style={styles.jobSprite} />
                            <Text style={styles.spriteLabel}>Warrior</Text>
                        </Pressable>
                        <Pressable style={[{borderColor: this.state.mageBorder}, styles.jobSelect]}
                            onPress={() => {this.setJob('Mage'),
                            this.setWarBorder('#303030'),
                            this.setMageBorder('green'),
                            this.setRangBorder('#303030'),
                            this.setNinBorder('#303030')}}
                        >
                            <Image source={this.state.mage} style={styles.jobSprite} />
                            <Text style={styles.spriteLabel}>Mage</Text>
                        </Pressable>
                        <Pressable style={[{borderColor: this.state.rangBorder}, styles.jobSelect]}
                            onPress={() => {this.setJob('Ranger'),
                            this.setWarBorder('#303030'),
                            this.setMageBorder('#303030'),
                            this.setRangBorder('green'),
                            this.setNinBorder('#303030')}}
                        >
                            <Image source={this.state.ranger} style={styles.jobSprite} />
                            <Text style={styles.spriteLabel}>Ranger</Text>
                        </Pressable>
                        <Pressable style={[{borderColor: this.state.ninBorder}, styles.jobSelect]}
                            onPress={() => {this.setJob('Ninja'),
                            this.setWarBorder('#303030'),
                            this.setMageBorder('#303030'),
                            this.setRangBorder('#303030'),
                            this.setNinBorder('green')}}
                        >
                            <Image source={this.state.ninja} style={styles.jobSprite} />
                            <Text style={styles.spriteLabel}>Ninja</Text>
                        </Pressable>
                    </View>
                    <View style={styles.startGame}>
                        <Pressable style={({pressed}) =>
                            [{borderBottomWidth: pressed ? 0 : 5,
                                    borderRightWidth: pressed ? 0 : 5,},
                            styles.landingBtn
                            ]}
                            onPress={() => {this.startNav('Dungeon', this.state.name, this.state.job, this.state.id)}}
                        >
                            <Text style={styles.landingBtnTxt}>Begin Game</Text>
                        </Pressable>
                    </View>
                    <View style={styles.startGame}>
                        <Pressable style={({pressed}) =>
                            [{borderBottomWidth: pressed ? 0 : 5,
                                borderRightWidth: pressed ? 0 : 5,},
                                styles.backBtn
                            ]}
                            onPress={() => this.setPage(1)}
                        >
                            <Text style={styles.landingBtnTxt}>Back to Main Screen</Text>
                        </Pressable>
                    </View>
                </Pressable>
            )
        } else if (this.state.pageNum === 4) { // Stats Page
            return (
                <>
                <View style={styles.container}>
                    <View style={styles.stats}>
                        <Text style={styles.statHeader}>Name</Text>
                        <Text style={styles.statHeader}>Job</Text>
                        <Text style={styles.statHeader}>Victory?</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Stat db={db} />
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <Pressable style={({pressed}) =>
                        [{borderBottomWidth: pressed ? 0 : 5,
                            borderRightWidth: pressed ? 0 : 5,},
                            styles.landingBtn
                        ]}
                        onPress={() => this.setPage(1)}
                    >
                        <Text style={styles.landingBtnTxt}>Back to Main Screen</Text>
                    </Pressable>
                </View>
                </>
            )
        }
    }
}
