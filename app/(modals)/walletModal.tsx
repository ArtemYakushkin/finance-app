import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { colors, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService';
import { WalletType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

const WalletModal = () => {
	const { user } = useAuth();
	const [wallet, setWallet] = useState<WalletType>({
		name: '',
		image: null,
	});
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const oldWallet: { name: string; image: string; id: string } =
		useLocalSearchParams();

	useEffect(() => {
		if (oldWallet?.id) {
			setWallet({
				name: oldWallet?.name,
				image: oldWallet?.image,
			});
		}
	}, []);

	const onDelete = async () => {
		if (!oldWallet?.id) return;
		setLoading(true);
		const res = await deleteWallet(oldWallet?.id);
		setLoading(false);

		if (res.success) {
			router.back();
		} else {
			Alert.alert('Гаманець', res.msg);
		}
	};

	const showDeleteAlert = () => {
		Alert.alert(
			'Підтвердити',
			"Ви впевнені, що хочете це зробити? \nЦя дія видалить усі транзакції, пов'язані з цим гаманцем",
			[
				{
					text: 'Скасувати',
					onPress: () => console.log('cancel delete'),
					style: 'cancel',
				},
				{
					text: 'Видалити',
					onPress: () => onDelete(),
					style: 'destructive',
				},
			],
		);
	};

	const onSubmit = async () => {
		let { name, image } = wallet;

		if (!name.trim() || !image) {
			Alert.alert('Гаманець', 'Будь ласка, заповніть усі поля');
			return;
		}

		const data: WalletType = {
			name,
			image,
			uid: user?.uid,
		};

		if (oldWallet?.id) data.id = oldWallet?.id;

		setLoading(true);
		const res = await createOrUpdateWallet(data);
		setLoading(false);

		if (res.success) {
			router.back();
		} else {
			Alert.alert('Гаманець', res.msg);
		}
	};

	return (
		<ModalWrapper>
			<View style={styles.container}>
				<Header
					title={
						oldWallet?.id ? 'Оновити гаманець' : 'Новий гаманець'
					}
					leftIcon={<BackButton />}
					style={{ marginBottom: spacingY._10 }}
				/>
				<ScrollView contentContainerStyle={styles.form}>
					<View style={styles.inputContainer}>
						<Typo color={colors.neutral200}>Назва гаманця</Typo>
						<Input
							placeholder="Назва гаманця"
							value={wallet.name}
							onChangeText={(value) =>
								setWallet({ ...wallet, name: value })
							}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Typo color={colors.neutral200}>Значок гаманця</Typo>
						<ImageUpload
							file={wallet.image}
							onSelect={(file) =>
								setWallet({ ...wallet, image: file })
							}
							onClear={() =>
								setWallet({ ...wallet, image: null })
							}
							placeholder="Завантажити зображення"
						/>
					</View>
				</ScrollView>
			</View>

			<View style={styles.footer}>
				{oldWallet?.id && (
					<Button
						style={{ marginRight: 5 }}
						onPress={showDeleteAlert}
					>
						<Icons.Trash
							color={colors.rose}
							size={verticalScale(24)}
							weight="bold"
						/>
					</Button>
				)}
				<Button
					onPress={onSubmit}
					loading={loading}
					style={{ flex: 1 }}
				>
					<Typo
						fontWeight={'700'}
						color={colors.primaryLight}
						size={21}
					>
						{oldWallet?.id ? 'Оновити' : 'Додати'}
					</Typo>
				</Button>
			</View>
		</ModalWrapper>
	);
};

export default WalletModal;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		paddingHorizontal: spacingY._20,
	},
	footer: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		paddingHorizontal: spacingY._20,
		gap: scale(24),
		paddingTop: spacingY._15,
		borderTopColor: colors.neutral700,
		borderTopWidth: 1,
		marginBottom: spacingY._60,
	},
	form: {
		gap: spacingY._30,
		marginTop: spacingY._15,
	},
	avatarContainer: {
		position: 'relative',
		alignSelf: 'center',
	},
	avatar: {
		alignSelf: 'center',
		backgroundColor: colors.neutral300,
		height: verticalScale(135),
		width: verticalScale(135),
		borderRadius: 200,
		borderWidth: 1,
		borderColor: colors.neutral500,
	},
	editIcon: {
		position: 'absolute',
		bottom: spacingY._5,
		right: spacingY._7,
		borderRadius: 100,
		backgroundColor: colors.neutral300,
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.25,
		shadowRadius: 10,
		elevation: 4,
		padding: spacingY._7,
	},
	inputContainer: {
		gap: spacingY._10,
	},
});
