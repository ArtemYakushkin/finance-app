import { MAIN_GRADIENT } from '@/constants/gradient';
import { ScreenWrapperProps } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Platform, StatusBar, View } from 'react-native';

const { height } = Dimensions.get('window');

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
	let paddingTop = Platform.OS == 'ios' ? height * 0.06 : 50;

	return (
		<LinearGradient {...(MAIN_GRADIENT as any)} style={[{ paddingTop, flex: 1 }, style]}>
			<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
			<View style={{ flex: 1 }}>{children}</View>
		</LinearGradient>
	);
};

export default ScreenWrapper;
