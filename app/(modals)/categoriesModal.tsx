import Button from '@/components/Button';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { categoryGroups } from '@/constants/data'; // Берем список групп (Food, Health и т.д.)
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { createOrUpdateCategory } from '@/services/categoryService'; // Нужно будет создать этот сервис
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

const CategoriesModal = () => {
	const { user } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [category, setCategory] = useState({
		name: '',
		group: '', // Сюда запишем value из categoryGroups
		type: 'expense', // По умолчанию расходная категория
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
			<View style={styles.container}>
				<Typo size={24} fontWeight={'700'} style={{ marginBottom: spacingY._20 }}>
					Нова категорія
				</Typo>

				<View style={styles.form}>
					{/* Название категории */}
					<View style={styles.inputContainer}>
						<Typo color={colors.neutral200} size={16}>
							Назва підкатегорії
						</Typo>
						<Input
							placeholder="Наприклад: Овочі або Кіно"
							value={category.name}
							onChangeText={(value) => setCategory({ ...category, name: value })}
						/>
					</View>

					{/* Выбор родительской группы */}
					<View style={styles.inputContainer}>
						<Typo color={colors.neutral200} size={16}>
							Виберіть групу
						</Typo>
						<View style={styles.groupsGrid}>
							{categoryGroups.map((group) => {
								const isActive = category.group === group.value;
								return (
									<TouchableOpacity
										key={group.value}
										onPress={() => setCategory({ ...category, group: group.value })}
										style={[
											styles.groupItem,
											isActive && {
												borderColor: group.color,
												backgroundColor: colors.neutral800,
											},
										]}
									>
										<Typo
											size={12}
											color={isActive ? group.color : colors.neutral400}
											fontWeight={isActive ? '700' : '400'}
										>
											{group.label}
										</Typo>
									</TouchableOpacity>
								);
							})}
						</View>
					</View>
				</View>

				{/* Кнопка сохранения */}
				<View style={styles.footer}>
					<Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
						<Typo color={colors.black} fontWeight={'700'}>
							Зберегти
						</Typo>
					</Button>
				</View>
			</View>
		</ModalWrapper>
	);
};

export default CategoriesModal;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: spacingX._20,
	},
	form: {
		gap: spacingY._20,
	},
	inputContainer: {
		gap: spacingY._10,
	},
	groupsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	groupItem: {
		paddingVertical: spacingY._10,
		paddingHorizontal: spacingX._12,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: colors.neutral700,
		backgroundColor: colors.neutral900,
	},
	footer: {
		marginTop: 'auto',
		paddingVertical: spacingY._20,
	},
});
