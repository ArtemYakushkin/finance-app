import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { getProfileImage } from '@/services/imageService';
import { updateUser } from '@/services/userService';
import { globalStyles } from '@/styles/global';
import { UserDataType } from '@/types';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';

const ProfileModal = () => {
	const { user, updateUserData } = useAuth();
	const [userData, setUserData] = useState<UserDataType>({
		name: '',
		image: null,
	});
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setUserData({
			name: user?.name || '',
			image: user?.image || null,
		});
	}, [user]);

	const onPickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			setUserData({ ...userData, image: result.assets[0] });
		}
	};

	const onSubmit = async () => {
		let { name, image } = userData;

		if (!name.trim()) {
			Alert.alert('Користувач', 'Будь ласка, заповніть усі поля');
			return;
		}

		setLoading(true);
		const res = await updateUser(user?.uid as string, userData);
		setLoading(true);
		if (res.success) {
			updateUserData(user?.uid as string);
			router.back();
		} else {
			Alert.alert('Користувач', res.msg);
		}
	};

	return (
		<ModalWrapper>
			<View style={[globalStyles.container, { justifyContent: 'space-between' }]}>
				<Header title="Оновити профіль" leftIcon={<BackButton />} />
				<ScrollView contentContainerStyle={globalStyles.modalForm}>
					<View style={globalStyles.modalAvatarContainer}>
						<Image
							style={globalStyles.modalAvatar}
							source={getProfileImage(userData.image)}
							contentFit="cover"
							transition={100}
						/>
						<TouchableOpacity onPress={onPickImage} style={globalStyles.modalEditIcon}>
							<Icons.Pencil size={20} color={colors.neutral800} />
						</TouchableOpacity>
					</View>

					<View style={{ gap: 10, paddingHorizontal: 5 }}>
						<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 5 }}>
							Ім'я
						</Typo>
						<Input
							placeholder="Ім'я"
							value={userData.name}
							onChangeText={(value) => setUserData({ ...userData, name: value })}
						/>
					</View>
				</ScrollView>
			</View>

			<View style={globalStyles.modalFooter}>
				<Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
					<Typo fontWeight={'700'} color={colors.primaryLight} size={21}>
						Оновити
					</Typo>
				</Button>
			</View>
		</ModalWrapper>
	);
};

export default ProfileModal;
