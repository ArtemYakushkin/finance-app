import { colors, radius, spacingX } from '@/constants/theme';
import { scale, verticalScale } from '@/utils/styling';
import * as Icons from 'phosphor-react-native';
import React, { useState } from 'react';
import {
	Dimensions,
	Platform,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import Modal from 'react-native-modal';
import { Shadow } from 'react-native-shadow-2';
import Typo from './Typo';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CalculatorProps {
	isVisible: boolean;
	onClose: (value: string) => void;
	initialValue: string;
}

interface CalcButtonProps {
	text: string;
	onPress: () => void;
	isDone?: boolean;
	isEqual?: boolean;
	isDouble?: boolean; // Проп для широких кнопок
}

const CalcButton = ({
	text,
	onPress,
	isDone,
	isEqual,
	isDouble,
}: CalcButtonProps) => {
	let bgColor = colors.neutral900;
	let textColor = colors.white;

	if (isEqual) textColor = colors.primary;
	if (isDone) {
		textColor = colors.primaryLight;
	}

	return (
		<View style={[styles.buttonWrapper, isDouble && styles.buttonDouble]}>
			{/* Светлый блик */}
			<Shadow
				distance={scale(4)}
				startColor={'rgba(255, 255, 255, 0.05)'}
				offset={[-scale(2), -scale(2)]}
				stretch
				style={{ borderRadius: radius._12 }}
			>
				{/* Темная тень */}
				<Shadow
					distance={scale(5)}
					startColor={'rgba(0, 0, 0, 0.6)'}
					offset={[scale(3), scale(3)]}
					stretch
					style={{ borderRadius: radius._12 }}
				>
					<TouchableOpacity
						style={[
							styles.buttonInner,
							{ backgroundColor: bgColor },
						]}
						onPress={onPress}
						activeOpacity={0.7}
					>
						{text === 'back' ? (
							<Icons.Backspace
								size={scale(27)}
								color={textColor}
								weight="bold"
							/>
						) : (
							<Typo size={20} fontWeight="600" color={textColor}>
								{text}
							</Typo>
						)}
					</TouchableOpacity>
				</Shadow>
			</Shadow>
		</View>
	);
};

const CalculatorModal = ({
	isVisible,
	onClose,
	initialValue,
}: CalculatorProps) => {
	const [expression, setExpression] = useState(initialValue || '0');

	const handlePress = (val: string) => {
		if (val === 'C') {
			setExpression('0');
		} else if (val === '=') {
			try {
				const sanitized = expression
					.replace(/×/g, '*')
					.replace(/÷/g, '/');
				const result = eval(sanitized);
				setExpression(
					String(
						Number.isInteger(result) ? result : result.toFixed(2),
					),
				);
			} catch {
				setExpression('Error');
				setTimeout(() => setExpression('0'), 1000);
			}
		} else if (val === 'back') {
			setExpression((prev) =>
				prev.length > 1 ? prev.slice(0, -1) : '0',
			);
		} else {
			setExpression((prev) =>
				prev === '0' && val !== '.' ? val : prev + val,
			);
		}
	};

	return (
		<Modal
			isVisible={isVisible}
			onBackdropPress={() => onClose(expression)}
			onSwipeComplete={() => onClose(expression)}
			swipeDirection="down"
			style={styles.modal}
			backdropOpacity={0.5}
			deviceHeight={SCREEN_HEIGHT}
			statusBarTranslucent
		>
			<View style={styles.container}>
				<View style={styles.handle} />

				<View style={styles.displayWrapper}>
					<Shadow
						distance={4}
						startColor={'rgba(0,0,0,0.5)'}
						offset={[1, 1]}
						stretch
						style={{ borderRadius: radius._12 }}
					>
						<View style={styles.displayInner}>
							<Typo
								size={32}
								fontWeight="700"
								color={colors.white}
							>
								{expression}
							</Typo>
						</View>
					</Shadow>
				</View>

				<View style={styles.grid}>
					{/* Ряд 1 */}
					<CalcButton text="7" onPress={() => handlePress('7')} />
					<CalcButton text="8" onPress={() => handlePress('8')} />
					<CalcButton text="9" onPress={() => handlePress('9')} />
					<CalcButton text="÷" onPress={() => handlePress('÷')} />

					{/* Ряд 2 */}
					<CalcButton text="4" onPress={() => handlePress('4')} />
					<CalcButton text="5" onPress={() => handlePress('5')} />
					<CalcButton text="6" onPress={() => handlePress('6')} />
					<CalcButton text="×" onPress={() => handlePress('×')} />

					{/* Ряд 3 */}
					<CalcButton text="1" onPress={() => handlePress('1')} />
					<CalcButton text="2" onPress={() => handlePress('2')} />
					<CalcButton text="3" onPress={() => handlePress('3')} />
					<CalcButton text="-" onPress={() => handlePress('-')} />

					{/* Ряд 4 */}
					<CalcButton text="0" onPress={() => handlePress('0')} />
					<CalcButton text="C" onPress={() => handlePress('C')} />
					<CalcButton
						text="back"
						onPress={() => handlePress('back')}
					/>
					<CalcButton text="+" onPress={() => handlePress('+')} />

					{/* Ряд 5 */}
					<CalcButton
						text="="
						onPress={() => handlePress('=')}
						isEqual
						isDouble
					/>
					<CalcButton
						text="Done"
						onPress={() => onClose(expression)}
						isDone
						isDouble
					/>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: { justifyContent: 'flex-end', margin: 0 },
	container: {
		backgroundColor: colors.neutral900,
		borderTopLeftRadius: radius._30,
		borderTopRightRadius: radius._30,
		paddingBottom: verticalScale(Platform.OS === 'ios' ? 40 : 20),
		minHeight: SCREEN_HEIGHT * 0.55,
	},
	handle: {
		width: scale(40),
		height: scale(5),
		backgroundColor: colors.neutral700,
		borderRadius: radius._10,
		alignSelf: 'center',
		marginVertical: spacingX._15,
	},
	displayWrapper: {
		paddingHorizontal: spacingX._15,
		marginBottom: spacingX._20,
	},
	displayInner: {
		backgroundColor: '#121212',
		padding: spacingX._20,
		alignItems: 'flex-end',
		borderRadius: radius._12,
		height: verticalScale(65),
		justifyContent: 'center',
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: spacingX._10,
		justifyContent: 'space-between',
	},
	buttonWrapper: {
		width: '23%',
		marginVertical: scale(6),
		height: verticalScale(60),
	},
	buttonDouble: {
		width: '48%',
	},
	buttonInner: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: radius._12,
		paddingVertical: 10,
	},
});

export default CalculatorModal;
