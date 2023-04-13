/**
 * @file    Dungeon.js
 * @author  Claire Fleckney
 * @date    March 27, 2023
 * @brief   This is the component file for running
 *          the dungeon crawl portion of the app
 */

import React, { Component } from "react";
import { Image, Pressable, View } from 'react-native';
import styles from './Style';

export default class Dungeon extends Component {
    constructor(props) {
        super(props);
        /*
        * Expected props:
        *       job
        *       name
        *       navigation
        */
        this.state = {
            mazeNum: (Math.floor(Math.random() * 100)) % 4,
            mazeArray: Array(9).fill(null).map(row => new Array(13).fill(null)),
            path: require('./assets/sprites/dungeon-tiles/path.png'),
            wall: require('./assets/sprites/dungeon-tiles/wall.png'),
            treasure: require('./assets/sprites/dungeon-tiles/treasure.png'),
            entrance: require('./assets/sprites/dungeon-tiles/entrance.png'),
            victory: require('./assets/sprites/dungeon-tiles/victory.png'),
            start: undefined,
            up: undefined,
            down: undefined,
            left: undefined,
            right: undefined,
            hp: undefined,
            attack: undefined,
            defense: undefined,
            job: props.job,
            name: props.name,
            x: 3,
            y: 0,
            musicStatus: props.music || true,
        };
    }

    /**
     * Sets the tile as the player moves
     * @function setTile()
     * @param {int} x 
     * @param {int} y 
     * @param {state} img 
     */
    setTile = (x, y, img) => {
        let newArray = this.state.mazeArray;
        newArray[x][y] = img;
        this.setState({ mazeArray: newArray });
    };

    /**
     * Sets the sprites based on character creation
     * @function setSprites()
     */
    setSprites = () => {
        if (this.state.job == 'Mage') { // Sprites for mage
            this.setState({
                start: require('./assets/sprites/mage/start.png'),
                up: require('./assets/sprites/mage/up.png'),
                down: require('./assets/sprites/mage/down.png'),
                left: require('./assets/sprites/mage/left.png'),
                right: require('./assets/sprites/mage/right.png'),
            });
        } else if (this.state.job == 'Ninja') { // Sprites for ninja
            this.setState({
                start: require('./assets/sprites/ninja/start.png'),
                up: require('./assets/sprites/ninja/up.png'),
                down: require('./assets/sprites/ninja/down.png'),
                left: require('./assets/sprites/ninja/left.png'),
                right: require('./assets/sprites/ninja/right.png'),
            });
        } else if (this.state.job == 'Ranger') { // Sprites for ranger
            this.setState({
                start: require('./assets/sprites/ranger/start.png'),
                up: require('./assets/sprites/ranger/up.png'),
                down: require('./assets/sprites/ranger/down.png'),
                left: require('./assets/sprites/ranger/left.png'),
                right: require('./assets/sprites/ranger/right.png'),
            });
        } else if (this.state.job == 'Warrior') { // Sprites for warrior
            this.setState({
                start: require('./assets/sprites/warrior/start.png'),
                up: require('./assets/sprites/warrior/up.png'),
                down: require('./assets/sprites/warrior/down.png'),
                left: require('./assets/sprites/warrior/left.png'),
                right: require('./assets/sprites/warrior/right.png'),
            });
        }
    };

    /**
     * Pulls the character stats from the db based on job
     * and adds the stats
     * @function getStats()
     * @see     setStats()
     */
    getStats = () => {
        const db = this.props.db;
        db.transaction(
            (tx) => {
                tx.executeSql(
                    'select hp, attack, defense from jobstats where job = ?;',
                    [this.state.job],
                    (_, { rows: { _array } }) => this.setStats(_array),
                    (err) => console.log('select >>>>> ', err),
                );
            },
            (err) => console.log('tx >>>>> ', err)
        )
    };

    /**
     * Sets the stats for the player character
     * @function setStats()
     * @param {Array} stats
     */
    setStats = (stats) => {
        stats.map(({ hp, attack, defense }) => (
            this.setState({
                hp: hp,
                attack: attack,
                defense: defense,
            })
        ))
    };

    /**
     * Sets the initial maze tiles based on random mazeNum
     * @function setMaze()
     */
    setMaze = () => {

        switch (this.state.mazeNum) {
            case 0:
                this.setState({
                    mazeArray: [
                        [this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall],
                        [this.state.wall, this.state.path, this.state.path, this.state.path, this.state.path, this.state.path, this.state.wall, this.state.path, this.state.path, this.state.path, this.state.path, this.state.path, this.state.wall],
                        [this.state.wall, this.state.wall, this.state.wall, this.state.path, this.state.wall, this.state.wall, this.state.wall, this.state.path, this.state.wall, this.state.wall, this.state.wall, this.state.path, this.state.wall],
                        [this.state.start, this.state.path, this.state.path, this.state.path, this.state.wall, this.state.path, this.state.path, this.state.path, this.state.wall, this.state.path, this.state.wall, this.state.path, this.state.wall],
                        [this.state.wall, this.state.path, this.state.wall, this.state.wall, this.state.wall, this.state.path, this.state.wall, this.state.wall, this.state.wall, this.state.path, this.state.wall, this.state.path, this.state.wall],
                        [this.state.wall, this.state.path, this.state.wall, this.state.path, this.state.path, this.state.path, this.state.path, this.state.path, this.state.path, this.state.path, this.state.wall, this.state.path, this.state.treasure],
                        [this.state.wall, this.state.path, this.state.wall, this.state.path, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.path, this.state.wall],
                        [this.state.wall, this.state.path, this.state.path, this.state.path, this.state.wall, this.state.path, this.state.path, this.state.path, this.state.path, this.state.path, this.state.path, this.state.path, this.state.wall],
                        [this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall, this.state.wall]
                    ]
                });
                break;
            case 1:
                this.setState({
                    mazeArray: [
                        [this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall],
                        [this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.wall],
                        [this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall],
                        [this.state.start,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.wall],
                        [this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall],
                        [this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.path,this.state.path,this.state.wall,this.state.path,this.state.path,this.state.path,this.state.treasure],
                        [this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall],
                        [this.state.wall,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.wall,this.state.path,this.state.path,this.state.path,this.state.wall,this.state.path,this.state.wall],
                        [this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall]
                    ]
                });
                break;
            case 2:
                this.setState({
                    mazeArray: [
                        [this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall],
                        [this.state.wall,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.wall,this.state.path,this.state.wall],
                        [this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall],
                        [this.state.start,this.state.path,this.state.path,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.path,this.state.path,this.state.wall],
                        [this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.wall,this.state.wall,this.state.path,this.state.wall,this.state.wall,this.state.wall,this.state.path,this.state.wall],
                        [this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.path,this.state.path,this.state.wall,this.state.path,this.state.path,this.state.path,this.state.wall,this.state.path,this.state.treasure],
                        [this.state.wall,this.state.path,this.state.wall,this.state.wall,this.state.wall,this.state.path,this.state.wall,this.state.wall,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall],
                        [this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.wall,this.state.path,this.state.wall],
                        [this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall]
                    ]
                });
                break;
            case 3:
                this.setState({
                    mazeArray: [
                        [this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall],
                        [this.state.wall,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.wall,this.state.path,this.state.wall],
                        [this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall],
                        [this.state.start,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.wall,this.state.path,this.state.wall],
                        [this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.wall,this.state.wall,this.state.path,this.state.wall,this.state.wall,this.state.wall,this.state.path,this.state.wall],
                        [this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.path,this.state.path,this.state.wall,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.treasure],
                        [this.state.wall,this.state.path,this.state.wall,this.state.wall,this.state.wall,this.state.path,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.path,this.state.wall],
                        [this.state.wall,this.state.path,this.state.path,this.state.path,this.state.wall,this.state.path,this.state.wall,this.state.path,this.state.path,this.state.path,this.state.path,this.state.path,this.state.wall],
                        [this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall,this.state.wall]
                    ]
                });
                break;
        };
    };

    async componentDidMount() {
        this.setSprites();
        // bad practice, but the images weren't loading fast enough
        // And yes, Stephen, I tried using helper functions to cause a delay
        setTimeout(() => {
            this.setMaze();
            this.getStats();
        });
    };

    async componentWillUnmount() {
        const { remoteSound } = this.state;
        if (remoteSound) {
            remoteSound.stopAsync();
            remoteSound.unloadAsync();
        }
    }

    /**
     * Moves the player sprite one tile to the right
     * @function moveRight()
     * @see setTile()
     * @see combatCheck()
     * @returns {Error} if something goes wrong
     */
    moveRight = () => {
        // If the player tries to move into a wall
        if (this.state.mazeArray[this.state.x][this.state.y + 1] === this.state.wall) {
            this.setTile(this.state.x, this.state.y, this.state.right);
        // If the player tries to move along the path
        } else if (this.state.mazeArray[this.state.x][this.state.y + 1] === this.state.path) {
            // If the player is moving from the start position
            if (this.state.mazeArray[this.state.x][this.state.y] === this.state.start) {
                this.setTile(this.state.x, this.state.y, this.state.entrance);
                this.setTile(this.state.x, this.state.y + 1, this.state.right);
                this.setState({
                    y: this.state.y + 1,
                })
                this.combatCheck();
            // If the player is moving from a path position
            } else {
                this.setTile(this.state.x, this.state.y, this.state.path);
                this.setTile(this.state.x, this.state.y + 1, this.state.right);
                this.setState({
                    y: this.state.y + 1,
                })
                this.combatCheck();
            }
        } else if (this.state.mazeArray[this.state.x][this.state.y + 1] === this.state.treasure) {
            // If the player reaches the end of the maze
            this.setTile(this.state.x, this.state.y, this.state.path);
            this.setTile(this.state.x, this.state.y + 1, this.state.victory);
            this.setState({
                y: this.state.y + 1,
            })
            this.insertRecord(true);
            setTimeout(() => {
                this.victoryNav();
            }, 1000)
        // Something bad
        } else {
            console.log('error');
            return;
        }
    };

    /**
     * Moves the player sprite one tile to the left
     * @function moveLeft()
     * @see setTile()
     * @see combatCheck()
     * @returns {Error} if something goes wrong
     */
    moveLeft = () => {
        if (this.state.mazeArray[this.state.x][this.state.y] === this.state.victory) {
            return;
        // If the player tries to move into a wall
        } else if (this.state.mazeArray[this.state.x][this.state.y - 1] === this.state.wall) {
            this.setTile(this.state.x, this.state.y, this.state.left);
        // If the player is returning to the start position
        } else if (this.state.mazeArray[this.state.x][this.state.y - 1] === this.state.entrance) {
            this.setTile(this.state.x, this.state.y, this.state.path);
            this.setTile(this.state.x, this.state.y - 1, this.state.start);
            this.setState({
                y: this.state.y - 1,
            });
            this.combatCheck();
        // If the player is moving along the path
        } else if (this.state.mazeArray[this.state.x][this.state.y - 1] === this.state.path) {
            this.setTile(this.state.x, this.state.y, this.state.path);
            this.setTile(this.state.x, this.state.y - 1, this.state.left);
            this.setState({
                y: this.state.y - 1,
            });
            this.combatCheck();
        // Something bad
        } else {
            console.log('error');
            return;
        }
    };
    
    /**
     * Moves the player sprite one tile up
     * @function moveUp()
     * @see setTile()
     * @see combatCheck()
     * @returns {Error} if something goes wrong
     */
    moveUp = () => {
        // If the player tries to move into a wall
        if (this.state.mazeArray[this.state.x - 1][this.state.y] === this.state.wall) {
            this.setTile(this.state.x, this.state.y, this.state.up);
        // If the player is moving along the path
        } else if (this.state.mazeArray[this.state.x - 1][this.state.y] === this.state.path) {
            this.setTile(this.state.x, this.state.y, this.state.path);
            this.setTile(this.state.x - 1, this.state.y, this.state.up);
            this.setState({
                x: this.state.x - 1,
            });
            this.combatCheck();
        // Something bad
        } else {
            console.log('error');
            return;
        }
    };

    /**
     * Moves the player sprite one tile down
     * @function moveDown()
     * @see setTile()
     * @see combatCheck()
     * @returns {Error} if something goes wrong
     */
    moveDown = () => {
        // If the player tries to move into a wall
        if (this.state.mazeArray[this.state.x + 1][this.state.y] === this.state.wall) {
            this.setTile(this.state.x, this.state.y, this.state.down);
        // If the player is moving along the path
        } else if (this.state.mazeArray[this.state.x + 1][this.state.y] === this.state.path) {
            this.setTile(this.state.x, this.state.y, this.state.path);
            this.setTile(this.state.x + 1, this.state.y, this.state.down);
            this.setState({
                x: this.state.x + 1,
            });
            this.combatCheck();
        // Something bad
        } else {
            console.log('error');
            return;
        }
    };

    /**
     * Checks to see if combat happens
     * @function combatCheck()
     * @see fightNav()
     * @returns nothing if no combat happens
     */
    combatCheck = () => {
        const {navigation} = this.props;
        let combat = (Math.floor(Math.random() * 100));
        if (combat <= 15) {
            this.fightNav();
        } else if (combat > 15) {
            return;
        }
    };

    /**
     * Navigates to the fight screen
     * @function fightNav()
     */
    fightNav = () => {
        const {navigation} = this.props;
        {navigation.navigate('FightScreen', {job: this.state.job, name: this.state.name, hp: this.state.hp, attack: this.state.attack, defense: this.state.defense});};
    };

    /**
     * Navigates to the victory screen
     * @function victoryNav()
     */
    victoryNav = () => {
        const {navigation} = this.props;
        const{ remoteSound } = this.state;
            if (remoteSound) {
                remoteSound.stopAsync();
                remoteSound.unloadAsync();
            }
        {navigation.navigate('VictoryScreen')};
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
        return (
            <View style={styles.dungeonContainer}>
                <View style={styles.mapContainer}>
                    <View style={styles.mapRow}>
                        <Image source={this.state.mazeArray[0][0]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[0][1]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[0][2]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[0][3]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[0][4]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[0][5]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[0][6]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[0][7]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[0][8]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[0][9]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[0][10]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[0][11]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[0][12]} style={styles.mapTile} />
                    </View>
                    <View style={styles.mapRow}>
                        <Image source={this.state.mazeArray[1][0]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[1][1]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[1][2]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[1][3]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[1][4]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[1][5]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[1][6]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[1][7]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[1][8]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[1][9]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[1][10]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[1][11]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[1][12]} style={styles.mapTile} />
                    </View>
                    <View style={styles.mapRow}>
                        <Image source={this.state.mazeArray[2][0]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[2][1]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[2][2]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[2][3]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[2][4]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[2][5]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[2][6]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[2][7]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[2][8]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[2][9]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[2][10]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[2][11]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[2][12]} style={styles.mapTile} />
                    </View>
                    <View style={styles.mapRow}>
                        <Image source={this.state.mazeArray[3][0]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[3][1]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[3][2]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[3][3]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[3][4]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[3][5]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[3][6]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[3][7]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[3][8]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[3][9]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[3][10]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[3][11]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[3][12]} style={styles.mapTile} />
                    </View>
                    <View style={styles.mapRow}>
                        <Image source={this.state.mazeArray[4][0]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[4][1]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[4][2]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[4][3]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[4][4]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[4][5]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[4][6]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[4][7]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[4][8]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[4][9]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[4][10]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[4][11]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[4][12]} style={styles.mapTile} />
                    </View>
                    <View style={styles.mapRow}>
                        <Image source={this.state.mazeArray[5][0]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[5][1]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[5][2]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[5][3]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[5][4]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[5][5]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[5][6]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[5][7]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[5][8]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[5][9]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[5][10]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[5][11]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[5][12]} style={styles.mapTile} />
                    </View>
                    <View style={styles.mapRow}>
                        <Image source={this.state.mazeArray[6][0]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[6][1]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[6][2]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[6][3]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[6][4]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[6][5]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[6][6]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[6][7]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[6][8]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[6][9]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[6][10]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[6][11]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[6][12]} style={styles.mapTile} />
                    </View>
                    <View style={styles.mapRow}>
                        <Image source={this.state.mazeArray[7][0]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[7][1]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[7][2]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[7][3]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[7][4]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[7][5]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[7][6]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[7][7]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[7][8]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[7][9]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[7][10]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[7][11]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[7][12]} style={styles.mapTile} />
                    </View>
                    <View style={styles.mapRow}>
                        <Image source={this.state.mazeArray[8][0]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[8][1]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[8][2]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[8][3]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[8][4]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[8][5]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[8][6]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[8][7]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[8][8]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[8][9]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[8][10]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[8][11]} style={styles.mapTile} />
                        <Image source={this.state.mazeArray[8][12]} style={styles.mapTile} />
                    </View>
                </View>
                <View style={styles.dPadOut}>
                    <View style={styles.dPadIn}>
                        <Pressable style={({pressed}) =>
                            [{opacity: pressed ? .25 : 1},
                            styles.dButtonLeft]}
                            onPress={this.moveLeft}
                        >
                            <View style={styles.dButtonLeftArrow} />
                        </Pressable>
                        <Pressable style={({pressed}) =>
                            [{opacity: pressed ? .25 : 1},
                            styles.dButtonUp]}
                            onPress={this.moveUp}
                        >
                            <View style={styles.dButtonUpArrow} />
                        </Pressable>
                    </View>
                    <View style={styles.dPadIn}>
                        <Pressable style={({pressed}) =>
                            [{opacity: pressed ? .25 : 1},
                            styles.dButtonDown]}
                            onPress={this.moveDown}
                        >
                            <View style={styles.dButtonDownArrow} />
                        </Pressable>
                        <Pressable style={({pressed}) =>
                            [{opacity: pressed ? .25 : 1},
                            styles.dButtonRight]}
                            onPress={this.moveRight}
                            >
                            <View style={styles.dButtonRightArrow} />
                        </Pressable>
                    </View>
                </View>
            </View>
        )
    }
}
