import { colors } from '@/constants/theme';
import { ModalWrapperProps } from '@/types';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

const ModalWrapper = ({ style, children }: ModalWrapperProps) => {
	const router = useRouter();

	const gradientColors: [string, string, string] = [
		colors.gradientStart,
		colors.gradientMid,
		colors.gradientEnd,
	];

	return (
		<View style={styles.container}>
			<TouchableWithoutFeedback onPress={() => router.back()}>
				{Platform.OS === 'ios' ? (
					<BlurView
						intensity={40}
						tint="dark"
						style={[StyleSheet.absoluteFill]}
					/>
				) : (
					<View
						style={[
							StyleSheet.absoluteFill,
							{ backgroundColor: 'rgba(0, 0, 0, 0.8)' },
						]}
					/>
				)}
			</TouchableWithoutFeedback>

			<LinearGradient
				colors={gradientColors}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				locations={[0, 0.45, 1]}
				style={[styles.content, style]}
			>
				<View style={styles.handle} />
				{children}
			</LinearGradient>
		</View>
	);
};

export default ModalWrapper;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	content: {
		height: '90%',
		width: '100%',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		overflow: 'hidden',
		borderTopWidth: 1,
		borderLeftWidth: 0.5,
		borderRightWidth: 0.5,
		borderColor: 'rgba(255, 255, 255, 0.1)',
	},
	handle: {
		width: 40,
		height: 5,
		backgroundColor: 'rgba(255,255,255,0.2)',
		borderRadius: 5,
		alignSelf: 'center',
		marginTop: 12,
		marginBottom: 10,
	},
});
