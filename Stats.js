/**
 * @file    Stats.js
 * @author  Claire Fleckney
 * @date    March 27, 2023
 * @brief   This is the component that gets
 *          displayed on the stats screen
 */

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from './Style';

export default class Stat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record: null,
        }
    }

    /**
     * Sets the record state variable
     * @function setRecords()
     * @param {Array} record Character Records
     */
    setRecords = (record) => {
        this.setState({ record: record });
    }

    componentDidMount() {
        this.update();
    }

    /**
     * Pulls records from the db
     * @function update()
     * @see setRecords()
     */
    update = () => {
        this.props.db.transaction(
            (tx) => {
                tx.executeSql(
                    'select * from player order by id desc limit 15;',
                    [],
                    (_, { rows: { _array } }) => this.setRecords(_array),
                );
            },
        )
    }

    render() {
        if (this.state.record === null || this.state.record.length === 0) {
            return null;
        }

        return (
            <>
            <View style={styles.stats}>
                <View>
                    {this.state.record.map(({ id, name }) => (
                        <Text key={id} style={styles.statText}>{name}</Text>
                    ))}
                </View>
                <View>
                    {this.state.record.map(({ id, job }) => (
                        <Text key={id} style={styles.statText}>{job}</Text>
                    ))}
                </View>
                <View>
                    {this.state.record.map(({ id, victory }) => (
                        <Text key={id} style={styles.statText}>{victory ? 'Yes' : 'No'}</Text>
                    ))}
                </View>
            </View>
            </>
        )
    }
}
