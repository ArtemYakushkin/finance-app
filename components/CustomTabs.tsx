import { colors, radius, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
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
								distance={7}
								startColor={'#262626'}
								offset={[-2, -2]}
								stretch
								style={[
									styles.shadowWrapper,
									{ borderRadius: btnRadius },
								]}
							>
								<Shadow
									distance={7}
									startColor={'#101010'}
									offset={[2, 2]}
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
										{tabbarIcons[route.name]?.(isFocused)}
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
		backgroundColor: colors.neutral900,
		paddingBottom: Platform.OS === 'ios' ? spacingY._20 : spacingY._60,
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
});
