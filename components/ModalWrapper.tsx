import { colors, spacingY } from '@/constants/theme';
import { ModalWrapperProps } from '@/types';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

const ModalWrapper = ({
	style,
	children,
	bg = colors.neutral800,
}: ModalWrapperProps) => {
	return (
		<View
			style={[styles.container, { backgroundColor: bg }, style && style]}
		>
			{children}
		</View>
		// <Modal
		// 	transparent={true}
		// 	visible={visible}
		// 	animationType="slide"
		// 	onRequestClose={onClose}
		// >
		// 	{/* Оверлей (затемнение) */}
		// 	<Pressable style={styles.overlay} onPress={onClose}>
		// 		{/* ВАЖНО: Добавляем еще один Pressable вокруг контента и вызываем
		//            пустую функцию или просто ловим нажатие, чтобы клик по самому
		//            окну НЕ закрывал его (останавливаем всплытие события).
		//         */}
		// 		<Pressable
		// 			onPress={(e) => e.stopPropagation()}
		// 			style={{ width: '100%' }}
		// 		>
		// 			<View
		// 				style={[
		// 					styles.sheetContainer,
		// 					{ backgroundColor: bg },
		// 					style,
		// 				]}
		// 			>
		// 				{/* Полоска-хендл */}
		// 				<View style={styles.handle} />

		// 				{/* Если в пропсах передали children, рендерим их, иначе — дефолт */}
		// 				{children ? (
		// 					children
		// 				) : (
		// 					<>
		// 						<Text style={styles.title}>Заголовок меню</Text>
		// 						<Text>
		// 							Контент по умолчанию. Передайте элементы
		// 							внутрь ModalWrapper, чтобы изменить это.
		// 						</Text>
		// 						<TouchableOpacity
		// 							style={styles.button}
		// 							onPress={onClose}
		// 						>
		// 							<Text style={styles.buttonText}>
		// 								Закрыть
		// 							</Text>
		// 						</TouchableOpacity>
		// 					</>
		// 				)}
		// 			</View>
		// 		</Pressable>
		// 	</Pressable>
		// </Modal>
	);
};

export default ModalWrapper;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: Platform.OS == 'ios' ? spacingY._15 : 50,
		paddingBottom: Platform.OS == 'ios' ? spacingY._20 : spacingY._10,
	},
	// overlay: {
	// 	flex: 1,
	// 	backgroundColor: 'rgba(0,0,0,0.5)',
	// 	justifyContent: 'flex-end',
	// },
	// sheetContainer: {
	// 	// Цвет теперь берется из пропса bg (по умолчанию neutral800)
	// 	borderTopLeftRadius: 28,
	// 	borderTopRightRadius: 28,
	// 	padding: 20,
	// 	paddingBottom: 40, // Больше отступа снизу для удобства
	// 	minHeight: 200,
	// 	maxHeight: '80%',
	// 	elevation: 10,
	// 	shadowColor: '#000', // Тени для iOS (elevation только для Android)
	// 	shadowOffset: { width: 0, height: -2 },
	// 	shadowOpacity: 0.1,
	// 	shadowRadius: 10,
	// },
	// handle: {
	// 	width: 40,
	// 	height: 4,
	// 	backgroundColor: 'rgba(255,255,255,0.2)', // Делаем хендл полупрозрачным
	// 	borderRadius: 2,
	// 	alignSelf: 'center',
	// 	marginBottom: 15,
	// },
	// title: {
	// 	fontSize: 20,
	// 	fontWeight: 'bold',
	// 	color: 'white',
	// 	marginBottom: 10,
	// },
	// text: {
	// 	color: '#ccc',
	// },
	// button: {
	// 	marginTop: 20,
	// 	backgroundColor: '#2196F3',
	// 	padding: 15,
	// 	borderRadius: 12,
	// 	alignItems: 'center',
	// },
	// buttonText: {
	// 	color: 'white',
	// 	fontWeight: 'bold',
	// },
});
