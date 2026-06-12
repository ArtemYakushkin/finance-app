import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { auth } from '@/config/firebase';
import { SHADOW_AVATAR, SHADOW_OPTIONS } from '@/constants/shadow';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { getProfileImage } from '@/services/imageService';
import { globalStyles } from '@/styles/global';
import { accountOptionType } from '@/types';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';

const Profile = () => {
	const { user } = useAuth();
	const router = useRouter();

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
			<View style={globalStyles.container}>
				<Header title="Профіль" />

				<View style={globalStyles.profileInfo}>
					<Shadow {...SHADOW_AVATAR.light} style={{ borderRadius: 200 }}>
						<Shadow {...SHADOW_AVATAR.dark} style={{ borderRadius: 200 }}>
							<Image
								source={getProfileImage(user?.image)}
								style={globalStyles.profileAvatar}
								contentFit="cover"
								transition={100}
							/>
						</Shadow>
					</Shadow>

					<View style={globalStyles.profileNameContainer}>
						<Typo size={24} fontWeight={'600'} color={colors.neutral100}>
							{user?.name}
						</Typo>
						<Typo size={15} color={colors.neutral400}>
							{user?.email}
						</Typo>
					</View>
				</View>

				<View style={{ paddingHorizontal: 10 }}>
					<Shadow {...SHADOW_OPTIONS.light} style={{ borderRadius: 20 }}>
						<Shadow {...SHADOW_OPTIONS.dark} style={{ borderRadius: 20 }}>
							<View style={globalStyles.profileOptions}>
								{accountOptions.map((item, index) => {
									const isLast = index === accountOptions.length - 1;
									return (
										<Animated.View entering={FadeInDown.delay(index * 50).springify()} key={index}>
											<TouchableOpacity
												style={globalStyles.profileOptionsItem}
												activeOpacity={0.6}
												onPress={() => handlePress(item)}
											>
												<View
													style={[
														globalStyles.profileOptionsIcon,
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
												<Icons.CaretRight size={18} weight="bold" color={colors.neutral500} />
											</TouchableOpacity>

											{!isLast && <View style={globalStyles.profileOptionsSeparator} />}
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
