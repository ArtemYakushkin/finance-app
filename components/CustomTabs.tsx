import { colors, radius, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

const CustomTabs = ({ state, descriptors, navigation }: BottomTabBarProps) => {
	const bgColor = '#171717';
	const btnRadius = radius._12;

	const tabbarIcons: any = {
		index: (isFocused: boolean) => (
			<Icons.House
				size={verticalScale(28)}
				weight={isFocused ? 'fill' : 'regular'}
				color={isFocused ? colors.primaryLight : colors.neutral400}
			/>
		),
		statistics: (isFocused: boolean) => (
			<Icons.ChartBar
				size={verticalScale(28)}
				weight={isFocused ? 'fill' : 'regular'}
				color={isFocused ? colors.primaryLight : colors.neutral400}
			/>
		),
		wallet: (isFocused: boolean) => (
			<Icons.Wallet
				size={verticalScale(28)}
				weight={isFocused ? 'fill' : 'regular'}
				color={isFocused ? colors.primaryLight : colors.neutral400}
			/>
		),
		profile: (isFocused: boolean) => (
			<Icons.User
				size={verticalScale(28)}
				weight={isFocused ? 'fill' : 'regular'}
				color={isFocused ? colors.primaryLight : colors.neutral400}
			/>
		),
	};

	const gradientColors: [string, string, ...string[]] = [
		colors.gradientStart,
		colors.gradientMid,
	];
	const lightShadow = 'rgba(65, 71, 85, 0.5)';
	const darkShadow = colors.gradientEnd;

	return (
		<View style={[styles.tabbar]}>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					});
					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name, route.params);
					}
				};

				return (
					<View key={route.name} style={styles.itemWrapper}>
						{isFocused ? (
							<Shadow
								distance={6}
								startColor={lightShadow}
								offset={[-1, -1]}
								stretch
								containerStyle={{ borderRadius: btnRadius }}
								style={[
									styles.shadowWrapper,
									{ borderRadius: btnRadius },
								]}
							>
								<Shadow
									distance={8}
									startColor={darkShadow}
									offset={[3, 3]}
									stretch
									style={styles.shadowWrapper}
								>
									<TouchableOpacity
										onPress={onPress}
										style={[
											styles.tabbarItem,
											styles.activeItem,
											{ backgroundColor: bgColor },
										]}
									>
										<LinearGradient
											colors={gradientColors}
											start={{ x: 0, y: 0 }}
											end={{ x: 1, y: 1 }}
											style={[
												styles.button,
												{ borderRadius: btnRadius },
											]}
										>
											{tabbarIcons[route.name]?.(
												isFocused,
											)}
										</LinearGradient>
									</TouchableOpacity>
								</Shadow>
							</Shadow>
						) : (
							<TouchableOpacity
								onPress={onPress}
								style={styles.tabbarItem}
							>
								{tabbarIcons[route.name]?.(isFocused)}
							</TouchableOpacity>
						)}
					</View>
				);
			})}
		</View>
	);
};

export default CustomTabs;

const styles = StyleSheet.create({
	tabbar: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: colors.gradientEnd,
		paddingBottom: Platform.OS === 'ios' ? spacingY._20 : spacingY._60,
		paddingTop: 15,
	},
	shadowWrapper: {
		alignSelf: 'stretch',
	},
	itemWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	tabbarItem: {
		width: verticalScale(50),
		height: verticalScale(50),
		borderRadius: radius._12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	activeItem: {
		borderWidth: 1,
		borderColor: '#1B1B1B',
	},
	button: {
		height: verticalScale(50),
		width: '100%',
		paddingHorizontal: 16,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 0.8,
		borderColor: 'rgba(255, 255, 255, 0.08)',
	},
});
