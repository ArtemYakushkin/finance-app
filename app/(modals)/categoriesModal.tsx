import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { categoryGroups } from '@/constants/data';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { createOrUpdateCategory } from '@/services/categoryService';
import { globalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

const CategoriesModal = () => {
	const { user } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [category, setCategory] = useState({
		name: '',
		group: '',
		type: 'expense',
	});

	const onSubmit = async () => {
		if (!category.name || !category.group) {
			Alert.alert('Категорія', 'Будь ласка, заповніть назву та виберіть групу!');
			return;
		}

		setLoading(true);
		const res = await createOrUpdateCategory({
			...category,
			uid: user?.uid,
		});
		setLoading(false);

		if (res.success) {
			router.back();
		} else {
			Alert.alert('Помилка', res.msg);
		}
	};

	return (
		<ModalWrapper>
			<View style={[globalStyles.container, { justifyContent: 'space-between' }]}>
				<Header title={'Нова категорія'} leftIcon={<BackButton />} />

				<ScrollView
					contentContainerStyle={globalStyles.modalForm}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					<View style={{ gap: 10, paddingHorizontal: 5 }}>
						<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 5 }}>
							Назва підкатегорії
						</Typo>
						<Input
							placeholder="Наприклад: Продукти або Житло"
							value={category.name}
							onChangeText={(value) => setCategory({ ...category, name: value })}
						/>
					</View>

					<View style={{ gap: 10 }}>
						<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 10 }}>
							Виберіть групу
						</Typo>
						<View style={globalStyles.modalBtnWrap}>
							{categoryGroups.map((group) => {
								const isActive = category.group === group.value;
								return (
									<Button
										key={group.value}
										onPress={() => setCategory({ ...category, group: group.value })}
										style={{ flex: 1 }}
									>
										<Typo
											size={14}
											fontWeight={isActive ? '700' : '500'}
											color={isActive ? group.color : colors.neutral400}
										>
											{group.label}
										</Typo>
									</Button>
								);
							})}
						</View>
					</View>
				</ScrollView>
			</View>

			<View style={globalStyles.modalFooter}>
				<Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
					<Typo fontWeight={'700'} color={colors.primaryLight} size={21}>
						Зберегти
					</Typo>
				</Button>
			</View>
		</ModalWrapper>
	);
};

export default CategoriesModal;
