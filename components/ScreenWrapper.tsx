import { colors } from '@/constants/theme';
import { ScreenWrapperProps } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
	Dimensions,
	Platform,
	StatusBar,
	StyleSheet,
	View,
} from 'react-native';

const { height } = Dimensions.get('window');

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
	let paddingTop = Platform.OS == 'ios' ? height * 0.06 : 50;

	return (
		<LinearGradient
			colors={[
				colors.gradientStart,
				colors.gradientMid,
				colors.gradientEnd,
			]}
			start={{ x: 0.5, y: 0 }}
			end={{ x: 0.5, y: 1 }}
			locations={[0, 0.45, 1]}
			style={[styles.container, { paddingTop }, style]}
		>
			<StatusBar
				barStyle="light-content"
				translucent={true}
				backgroundColor="transparent"
			/>
			<View style={styles.content}>{children}</View>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
	},
});

export default ScreenWrapper;
