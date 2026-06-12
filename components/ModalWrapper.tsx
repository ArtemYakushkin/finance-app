import { MAIN_GRADIENT } from '@/constants/gradient';
import { colors } from '@/constants/theme';
import { globalStyles } from '@/styles/global';
import { ModalWrapperProps } from '@/types';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

const ModalWrapper = ({ style, children }: ModalWrapperProps) => {
	const router = useRouter();

	const gradientColors: [string, string, string] = [colors.gradientStart, colors.gradientMid, colors.gradientEnd];

	return (
		<View style={globalStyles.modalWrap}>
			<TouchableWithoutFeedback onPress={() => router.back()}>
				{Platform.OS === 'ios' ? (
					<BlurView intensity={40} tint="dark" style={[StyleSheet.absoluteFill]} />
				) : (
					<View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]} />
				)}
			</TouchableWithoutFeedback>

			<LinearGradient {...(MAIN_GRADIENT as any)} style={[globalStyles.modalContent, style]}>
				<View style={globalStyles.modalHandle} />
				{children}
			</LinearGradient>
		</View>
	);
};

export default ModalWrapper;
