import { colors } from '@/constants/theme';
import { ModalWrapperProps } from '@/types';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import {
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

const ModalWrapper = ({
	style,
	children,
	bg = colors.neutral900,
}: ModalWrapperProps) => {
	const router = useRouter();

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
							{ backgroundColor: 'rgba(0, 0, 0, 0.91)' },
						]}
					/>
				)}
			</TouchableWithoutFeedback>

			<View style={[styles.content, { backgroundColor: bg }, style]}>
				<View style={styles.handle} />
				{children}
			</View>
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
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -10 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 20,
	},
	handle: {
		width: 70,
		height: 5,
		backgroundColor: 'rgba(255,255,255,0.2)',
		borderRadius: 5,
		alignSelf: 'center',
		marginTop: 10,
		marginBottom: 15,
	},
});
