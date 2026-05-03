import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { auth } from '@/config/firebase';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { getProfileImage } from '@/services/imageService';
import { accountOptionType } from '@/types';
import { verticalScale } from '@/utils/styling';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';

const Profile = () => {
	const { user } = useAuth();
	const router = useRouter();
	const bgColor = '#171717';

	const accountOptions: accountOptionType[] = [
		{
			title: 'Редагувати профіль',
			icon: <Icons.User size={24} color={colors.white} weight="fill" />,
			routeName: '/(modals)/profileModal',
			bgColor: '#6366f1',
		},
		{
			title: 'Налаштування',
			icon: <Icons.GearSix size={24} color={colors.white} weight="fill" />,
			routeName: '/(modals)/settingsModal',
			bgColor: '#059669',
		},
		{
			title: 'Конфіденційність',
			icon: <Icons.Lock size={24} color={colors.white} weight="fill" />,
			bgColor: colors.neutral600,
		},
		{
			title: 'Вийти',
			icon: <Icons.Power size={24} color={colors.white} weight="fill" />,
			bgColor: '#e11d48',
		},
	];

	const handleLogout = async () => {
		await signOut(auth);
	};

	const showLogoutAlert = () => {
		Alert.alert('Підтвердити', 'Ви впевнені, що хочете вийти?', [
			{
				text: 'Скасувати',
				onPress: () => console.log('cancel logout'),
				style: 'cancel',
			},
			{
				text: 'Вийти',
				onPress: () => handleLogout(),
				style: 'destructive',
			},
		]);
	};

	const handlePress = (item: accountOptionType) => {
		if (item.title == 'Вийти') {
			showLogoutAlert();
		}

		if (item.routeName) {
			router.push(item.routeName);
		}
	};

	return (
		<ScreenWrapper>
			<View style={styles.container}>
				<Header title="Профіль" style={{ marginVertical: spacingY._10 }} />

				<View style={styles.userInfo}>
					<Shadow
						distance={15}
						startColor={'rgba(255, 255, 255, 0.08)'}
						offset={[-3, -3]}
						style={{ borderRadius: 200 }}
					>
						<Shadow
							distance={18}
							startColor={'rgba(5, 7, 10, 0.7)'} // Глубокий сине-черный цвет для тени
							offset={[5, 5]}
							style={{ borderRadius: 200 }}
						>
							<Image
								source={getProfileImage(user?.image)}
								style={styles.avatar}
								contentFit="cover"
								transition={100}
							/>
						</Shadow>
					</Shadow>

					<View style={styles.nameContainer}>
						<Typo size={24} fontWeight={'600'} color={colors.neutral100}>
							{user?.name}
						</Typo>
						<Typo size={15} color={colors.neutral400}>
							{user?.email}
						</Typo>
					</View>
				</View>

				<View style={styles.accountOptionsWrapper}>
					<Shadow
						distance={10}
						startColor={'rgba(60, 75, 100, 0.12)'}
						offset={[-3, -3]}
						stretch
						style={{ borderRadius: radius._20 }}
					>
						<Shadow
							distance={12}
							startColor={'rgba(0, 0, 0, 0.8)'}
							offset={[5, 5]}
							stretch
							style={{ borderRadius: radius._20 }}
						>
							<View
								style={[
									styles.optionsContent,
									{
										backgroundColor: '#171921',
										borderColor: 'rgba(255, 255, 255, 0.03)',
									},
								]}
							>
								{accountOptions.map((item, index) => {
									const isLast = index === accountOptions.length - 1;
									return (
										<Animated.View entering={FadeInDown.delay(index * 50).springify()} key={index}>
											<TouchableOpacity
												style={styles.optionRow}
												activeOpacity={0.6}
												onPress={() => handlePress(item)}
											>
												<View
													style={[
														styles.listIcon,
														{
															backgroundColor: item.bgColor,
														},
													]}
												>
													{item.icon}
												</View>
												<Typo size={16} fontWeight={'500'} style={{ flex: 1 }}>
													{item.title}
												</Typo>
												<Icons.CaretRight
													size={verticalScale(18)}
													weight="bold"
													color={colors.neutral500}
												/>
											</TouchableOpacity>

											{!isLast && <View style={styles.separator} />}
										</Animated.View>
									);
								})}
							</View>
						</Shadow>
					</Shadow>
				</View>
			</View>
		</ScreenWrapper>
	);
};

export default Profile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: spacingX._20,
	},
	userInfo: {
		marginTop: verticalScale(30),
		alignItems: 'center',
		gap: verticalScale(15),
	},
	avatar: {
		height: verticalScale(135),
		width: verticalScale(135),
		borderRadius: 200,
		borderWidth: 1.5,
		borderColor: 'rgba(255, 255, 255, 0.05)',
	},
	nameContainer: {
		gap: verticalScale(4),
		alignItems: 'center',
		marginTop: verticalScale(5),
	},
	accountOptionsWrapper: {
		marginTop: verticalScale(40),
	},
	optionsContent: {
		borderRadius: radius._20,
		paddingHorizontal: spacingX._15,
		borderWidth: 1,
		borderColor: '#1B1B1B',
	},
	optionRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacingX._15,
		paddingVertical: verticalScale(12),
	},
	listIcon: {
		height: verticalScale(40),
		width: verticalScale(40),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: radius._12,
	},
	separator: {
		height: 0.5,
		backgroundColor: 'rgba(255, 255, 255, 0.06)',
		marginHorizontal: spacingX._5,
	},
});
