import { colors, radius } from '@/constants/theme';
import { BackButtonProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import { CaretLeftIcon } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

const BackButton = ({ style, iconSize = 26 }: BackButtonProps) => {
	const router = useRouter();
	const bgColor = '#171717';
	const btnRadius = radius._12;

	return (
		<View style={[styles.outerContainer, style]}>
			<Shadow
				distance={3}
				startColor={'#262626'}
				offset={[-2, -2]}
				stretch
				style={{ borderRadius: btnRadius, pointerEvents: 'box-none' }}
			>
				<Shadow
					distance={3}
					startColor={'#101010'}
					offset={[2, 2]}
					stretch
					style={{ pointerEvents: 'box-none' }}
				>
					<TouchableOpacity
						onPress={(e) => {
							e.currentTarget.blur();

							if (router.canGoBack()) {
								router.back();
							}
						}}
						activeOpacity={0.7}
						style={[styles.button, { backgroundColor: bgColor }]}
					>
						<CaretLeftIcon
							size={verticalScale(iconSize)}
							color={colors.primaryLight}
							weight="bold"
						/>
					</TouchableOpacity>
				</Shadow>
			</Shadow>
		</View>
	);
};

export default BackButton;

const styles = StyleSheet.create({
	outerContainer: {
		alignSelf: 'flex-start',
		zIndex: 99,
	},
	button: {
		width: verticalScale(45),
		height: verticalScale(45),
		borderRadius: radius._12,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#1B1B1B',
		zIndex: 100,
	},
});
