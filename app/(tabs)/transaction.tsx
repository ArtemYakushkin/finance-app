import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Transaction = () => {
	return (
		<View style={styles.container}>
			<Text>transaction</Text>
		</View>
	);
};

export default Transaction;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
