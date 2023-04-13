/**
 * @file    Fight.js
 * @author  Claire Fleckney
 * @date    March 27, 2023
 * @brief   This is the Fight component for controlling
 *          the combat portion of the app
 */

import { Accelerometer } from 'expo-sensors';
import React, { Component } from "react";
import { Image, Text, View } from "react-native";
import GestureRecognizer, {swipeDirections} from "react-native-swipe-gestures";
import styles from './Style';

export default class Fight extends Component {
    constructor(props) {
        super(props);
        /*
        * Expected props:
        *       id
        *       job
        *       name
        *       navigation
        */
        this.state = {
            job: props.job,
            name: props.name,
            pHealth: props.hp,
            jobHealth: 50,
            pAttack: props.attack,
            pDefense: props.defense,
            eHealth: 50,
            sprite: undefined,
            action: false,
            attack: undefined,
            sAttack: undefined,
            defend: undefined,
            sDefend: undefined,
            combatEffect: undefined,
            special: false,
            enemy: require('./assets/sprites/fight-models/kobold.png'),
            enemyAttack: require('./assets/sprites/fight-models/k-attack.png'),
            enemyDefend: require('./assets/sprites/fight-models/k-defend.png'),
            eDefend: false,
            pDefend: false,
            specialDefend: false,
            playerTurn: undefined,
        };
    }

    async componentDidMount() {
        this.setSprite();
        this.coinFlip();
        this.addListener();
    };

    async componentWillUnmount() {
        const{ remoteSound } = this.state;
        if (remoteSound) {
            remoteSound.stopAsync();
            remoteSound.unloadAsync();
        }
        Accelerometer.removeAllListeners();
    }

    /**
     * Sets whos turn it is 
     * @function setPlayerTurn()
     * @param {bool} state Whose turn it is
     */
    setPlayerTurn = (state) => {
        this.setState({ playerTurn: state })
    }

    /**
     * Coin flip to decide who goes first
     * @function coinFlip()
     * @see setPlayerTurn()
     * @see enemyTurn()
     */
    coinFlip = () => {
        let coin = (Math.floor(Math.random() * 100)) % 2;

        if (coin == 1) {
            this.setPlayerTurn(true);
        } else {
            this.setPlayerTurn(false);
            this.enemyTurn();
        }
    }

    /**
     * Switches between player and enemy turns
     * @function switchTurns()
     * @see setPlayerTurn()
     * @see enemyTurn()
     */
    switchTurns = async () => {
        setTimeout(() => {
            if (this.state.playerTurn == true) {
                this.setPlayerTurn(false);
                this.enemyTurn();
            } else {
                this.setPlayerTurn(true);
            }
        }, 1000)
    }

    /**
     * Sets the player sprites based on job
     * @function setSprite()
     */
    setSprite = () => {
        if (this.state.job == 'Mage') {
            // Sprite for mage
            this.setState({
                sprite: require('./assets/sprites/fight-models/mage.png'),
                attack: require('./assets/sprites/fight-models/m-attack.png'),
                sAttack: require('./assets/sprites/fight-models/m-attack-s.png'),
                defend: require('./assets/sprites/fight-models/m-defend.png'),
                sDefend: require('./assets/sprites/fight-models/m-defend-s.png'),
            });
        } else if (this.state.job == 'Ninja') {
            // Sprite for ninja
            this.setState({
                sprite: require('./assets/sprites/fight-models/ninja.png'),
                attack: require('./assets/sprites/fight-models/n-attack.png'),
                sAttack: require('./assets/sprites/fight-models/n-attack-s.png'),
                defend: require('./assets/sprites/fight-models/n-defend.png'),
                sDefend: require('./assets/sprites/fight-models/n-defend-s.png'),
            });
        } else if (this.state.job == 'Ranger') {
            // Sprite for ranger
            this.setState({
                sprite: require('./assets/sprites/fight-models/ranger.png'),
                attack: require('./assets/sprites/fight-models/r-attack.png'),
                sAttack: require('./assets/sprites/fight-models/r-attack-s.png'),
                defend: require('./assets/sprites/fight-models/r-defend.png'),
                sDefend: require('./assets/sprites/fight-models/r-defend-s.png'),
            });
        } else if (this.state.job == 'Warrior') {
            // Sprite for warrior
            this.setState({
                sprite: require('./assets/sprites/fight-models/warrior.png'),
                attack: require('./assets/sprites/fight-models/w-attack.png'),
                sAttack: require('./assets/sprites/fight-models/w-attack-s.png'),
                defend: require('./assets/sprites/fight-models/w-defend.png'),
                sDefend: require('./assets/sprites/fight-models/w-defend-s.png'),
            });
        }
    };

    /**
     * The following code is courtesy of Charana Amaresekara
     * It is the handler and listener for Shake Events
     * Found at https://medium.com/@charana.am/react-native-shake-event-w-expo-9dbf17033ea9
     * @function addListener()
     * @see setSpecial()
     */
    addListener = () => {
        let lastX, lastY, lastZ;
        let lastUpdate = 0;

        Accelerometer.addListener(accelerometerData => {
            let { x, y, z } = accelerometerData;
            let currTime = Date.now();

            if ((currTime - lastUpdate) > 100) {
                let diffTime = (currTime - lastUpdate);
                lastUpdate = currTime;
                let speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

                /**
                 * This number is the shake sensitivity:
                 *      Higher Number is lower sensitivity
                 *      Lower Number is higher sensitivity
                 */
                if (speed > 600 && this.state.playerTurn == true) {
                    this.setSpecial(true);
                    console.log('shake');
                }

                lastX = x;
                lastY = y;
                lastZ = z;
            }
        });
    }

    /**
     * Sets the value for the special state variable
     * @function setSpecial()
     * @param {bool} val new value for the special state variable
     */
    setSpecial = (val) => {
        this.setState({ special: val });

        if (val == true) {
            // Change playersprite to show special "animation"
            setTimeout(() => {
                this.setState({ sprite: require('./assets/sprites/fight-models/special.png') })
                setTimeout(() => {
                    if (this.state.job == 'Mage') {
                        this.setState({ sprite: require('./assets/sprites/fight-models/mage.png') })
                    } else if (this.state.job == 'Ninja') {
                        this.setState({ sprite: require('./assets/sprites/fight-models/ninja.png') })
                    } else if (this.state.job == 'Ranger') {
                        this.setState({ sprite: require('./assets/sprites/fight-models/ranger.png') })
                    } else if (this.state.job == 'Warrior') {
                        this.setState({ sprite: require('./assets/sprites/fight-models/warrior.png') })
                    }
                }, 1000)
            })
        }
    }

    /**
     * Modifies the enemies health stat
     * @function damageEnemy()
     * @param {int} dmg Amount of damage done to the enemy
     * @see victory()
     */
    damageEnemy = (dmg) => {
        setTimeout(() => {
            this.setState({
                eHealth: this.state.eHealth - dmg,
            })
            if (this.state.eHealth <= 0){
                this.setState({
                    eHealth: 50,
                })
                this.victory();
            }
        })
    }

    /**
     * Modifies the players health stat
     * @function damagePlayer()
     * @param {int} dmg Amount of damage done to the player
     * @see gameOver()
     */
    damagePlayer = (dmg) => {
        setTimeout(() => {
            this.setState({
                pHealth: this.state.pHealth - dmg,
            })
            if (this.state.pHealth <= 0) {
                this.gameOver();
            }
        })
    }

    /**
     * Removes the defense state from the player
     * @function removePDefense()
     */
    removePDefense = () => {
        this.setState({
            pDefend: false,
            specialDefend: false,
        })
    }

    /**
     * Removes the defense state from the enemy
     * @function removeEDefense()
     */
    removeEDefense = () => {
        this.setState({
            eDefend: false,
        })
    }

    /**
     * Sets the image to be displayed during combat actions
     * as well as defense states
     * @function setCombatEffect()
     * @param {bool} act action state
     * @param {string} img combatEffect state variable
     * @param {bool} spec specialDefend state variable
     * @param {bool} def pDefend state variable
     */
    setCombatEffect = (act, img, spec, def) => {
        this.setState({
            action: act,
            combatEffect: img,
            specialDefend: spec,
            pDefend: def,
        })
    }

    /**
     * Handler for when the player swipes left to defend
     * @function onSwipeLeft()
     * @see setCombatEffect()
     * @see switchTurns()
     * @see setSpecial()
     */
    onSwipeLeft() {
        if (this.state.playerTurn) {
            setTimeout(() => {
                if (this.state.special === true) {
                    this.setCombatEffect(true, this.state.sDefend, true, false);
                } else if (this.state.special === false) {
                    this.setCombatEffect(true, this.state.defend, false, true);
                }
                setTimeout(() => {
                    if (this.state.special === true) {
                        this.setCombatEffect(false, undefined, true, false);
                    } else if (this.state.special === false) {
                        this.setCombatEffect(false, undefined, false, true);
                    }
                }, 1000)
                this.setSpecial(false);
            })
        }
        this.switchTurns();
    }

    /**
     * Handler for when the player swipes right to attack
     * @function onSwipeRight()
     * @see setCombatEffect()
     * @see damageEnemy()
     * @see removeEDefense()
     * @see setSpecial()
     * @see switchTurns()
     */
    onSwipeRight() {
        if (this.state.playerTurn) {
            let damage;
            setTimeout(() => {
                if (this.state.special === true) {
                    this.setCombatEffect(true, this.state.sAttack, false, false);
                    if (this.state.eDefend == true) {
                        damage = this.state.pAttack;
                    } else {
                        damage = this.state.pAttack * 2;
                    }
                } else if (this.state.special === false) {
                    this.setCombatEffect(true, this.state.attack, false, false);
                    if (this.state.eDefend == true) {
                        damage = this.state.pAttack / 2;
                    } else {
                        damage = this.state.pAttack;
                    }
                }
                setTimeout(() => {
                    this.setCombatEffect(false, undefined, false, false);
                }, 1000)
                this.setSpecial(false);
                this.damageEnemy(damage);
            })
            this.removeEDefense();
            this.switchTurns();
        }
    }

    /**
     * Decides which action the enemy takes
     * @function enemyTurn()
     * @see enAttack()
     * @see enDefend()
     * @returns After performing enemy action
     */
    enemyTurn = () => {
        let enemyAction = Math.floor(Math.random() * 100);

        if (enemyAction <= 60) {
            // Enemy Attack
            this.enAttack();
            return;
        } else if (enemyAction > 60) {
            // Enemy Defend
            this.enDefend();
            return;
        }
    }

    /**
     * Performs the enemy attack action
     * @function enAttack()
     * @see damagePlayer()
     * @see removePDefense()
     * @see switchTurns()
     */
    enAttack = () => {

        let damage;

        setTimeout(() => {
            this.enEffect(true, this.state.enemyAttack, false);

            if (this.state.specialDefend == true) {
                damage = 0;
            } else if (this.state.pDefend == true) {
                damage = 35 - (this.state.pDefense * 1.5);
            } else {
                damage = 35 - this.state.pDefense;
            }

            setTimeout(() => {
                this.enEffect(false, undefined, false);
            }, 1000)
            this.damagePlayer(damage);
        })
        this.removePDefense();
        this.switchTurns();
    }

    /**
     * Performs the enemy defend action
     * @function enDefend()
     * @see enEffect()
     * @see switchTurns()
     */
    enDefend = () => {
        setTimeout(() => {
            this.enEffect(true, this.state.enemyDefend, true);
            setTimeout(() => {
                this.enEffect(false, undefined, true)
            }, 1000)
        })
        this.switchTurns();
    }

    /**
     * Sets the image to be displayed during combat
     * as well as defense states
     * @function enEffect()
     * @param {bool} act action state variable
     * @param {string} img combatEffect state variable
     * @param {bool} def eDefend state variable
     */
    enEffect = (act, img, def) => {
        this.setState({
            action: act,
            combatEffect: img,
            eDefend: def,
        })
    }

    /**
     * Finishes the fight on victory
     * @function victory()
     * @see setPlayerTurn()
     */
    victory = () => {
        const { navigation } = this.props;
        this.setPlayerTurn(undefined);
        this.componentWillUnmount();
        setTimeout(() => {
            {navigation.navigate('Dungeon', {job: this.state.job, name: this.state.name,})};
        }, 500)
    };
    
    /**
     * Finishes the fight on loss
     * @function gameOver()
     */
    gameOver = () => {
        const { navigation } = this.props;
        this.insertRecord(false);
        setTimeout(() => {
            {navigation.navigate('Game Over')}
        })
    }

    /**
     * Inserts the record of the dungeon into the database
     * @function insertRecord()
     * @param {bool} end Whether or not victory was achieved
     */
    insertRecord = (end) => {
        const db = this.props.db;

        db.transaction(
            (tx) => {
                tx.executeSql(
                    'insert into player (name, job, victory) values (?, ?, ?);',
                    [this.state.name, this.state.job, end],
                    null,
                    (err) => console.log('insert >>>>> ', err)
                )
            }
        )
    }

    render() {

        let pHealthPercent = (this.state.pHealth/this.state.jobHealth) * 100;
        let eHealthPercent = (this.state.eHealth/50) * 100;

        return (
            <GestureRecognizer style={styles.combat}
                onSwipeRight={() => this.onSwipeRight()}
                onSwipeLeft={() => this.onSwipeLeft()}
            >
                <View style={styles.charSpriteView}>
                    <Text style={this.state.playerTurn ? styles.combatTextActive : styles.combatText}>{this.state.name}</Text>
                    <Image source={this.state.sprite} style={styles.charSprite} resizeMode='contain'/>
                    <View style={[{justifyContent: 'flex-start'}, styles.healthBar]}>
                        <View style={[{width: pHealthPercent+'%'}, styles.healthFill]}></View>
                    </View>
                </View>
                {this.state.action == true ? (
                    <Image style={styles.combatEffect} resizeMode='contain' source={this.state.combatEffect} />
                ) : (
                    <Image style={styles.combatEffect} />
                )}
                <View style={styles.charSpriteView}>
                    <Text style={this.state.playerTurn ? styles.combatText : styles.combatTextActive}>Kobold</Text>
                    <Image source={this.state.enemy} style={styles.charSprite} resizeMode='contain'/>
                    <View style={[{justifyContent: 'flex-start'}, styles.healthBar]}>
                        <View style={[{width: eHealthPercent+'%'}, styles.healthFill]}></View>
                    </View>
                </View>
            </GestureRecognizer>
        )
    };
}
