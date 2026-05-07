import { colors, radius, spacingX } from '@/constants/theme';
import { scale, verticalScale } from '@/utils/styling';
import { LinearGradient } from 'expo-linear-gradient';
import * as Icons from 'phosphor-react-native';
import React, { useState } from 'react';
import { Dimensions, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
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
	isDouble?: boolean;
}

const CalcButton = ({ text, onPress, isDone, isEqual, isDouble }: CalcButtonProps) => {
	const gradientColors: [string, string] = [colors.gradientStart as string, colors.gradientMid as string];

	let textColor = colors.neutral400;

	if (isEqual) textColor = colors.primary;
	if (isDone) {
		textColor = colors.primaryLight;
	}

	return (
		<View style={[styles.buttonWrapper, isDouble && styles.buttonDouble]}>
			<TouchableOpacity
				onPress={onPress}
				activeOpacity={0.8}
				style={{
					borderRadius: radius._12,
					borderWidth: 1,
					borderColor: colors.neutral300,
					paddingVertical: 10,
					alignItems: 'center',
				}}
			>
				{text === 'back' ? (
					<Icons.Backspace size={scale(22)} color={textColor} weight="bold" style={{ paddingVertical: 3 }} />
				) : (
					<Typo size={20} fontWeight="700" color={textColor}>
						{text}
					</Typo>
				)}
			</TouchableOpacity>
		</View>
	);
};

const CalculatorModal = ({ isVisible, onClose, initialValue }: CalculatorProps) => {
	const [expression, setExpression] = useState(initialValue || '0');

	const handlePress = (val: string) => {
		if (val === 'C') {
			setExpression('0');
		} else if (val === '=') {
			try {
				const sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/');
				const result = eval(sanitized);
				setExpression(String(Number.isInteger(result) ? result : result.toFixed(2)));
			} catch {
				setExpression('Error');
				setTimeout(() => setExpression('0'), 1000);
			}
		} else if (val === 'back') {
			setExpression((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
		} else {
			setExpression((prev) => (prev === '0' && val !== '.' ? val : prev + val));
		}
	};

	return (
		<Modal
			isVisible={isVisible}
			onBackdropPress={() => onClose(expression)}
			onSwipeComplete={() => onClose(expression)}
			swipeDirection="down"
			style={styles.modal}
			backdropOpacity={0.6}
			deviceHeight={SCREEN_HEIGHT}
			statusBarTranslucent
		>
			<LinearGradient
				colors={[colors.gradientStart as string, colors.gradientMid as string, colors.gradientEnd as string]}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={styles.container}
			>
				<View style={styles.handle} />

				<View style={styles.displayWrapper}>
					<View style={styles.displayInner}>
						<Typo size={32} fontWeight="700" color={colors.white}>
							{expression}
						</Typo>
					</View>
				</View>

				<View style={styles.grid}>
					<CalcButton text="7" onPress={() => handlePress('7')} />
					<CalcButton text="8" onPress={() => handlePress('8')} />
					<CalcButton text="9" onPress={() => handlePress('9')} />
					<CalcButton text="÷" onPress={() => handlePress('÷')} />

					<CalcButton text="4" onPress={() => handlePress('4')} />
					<CalcButton text="5" onPress={() => handlePress('5')} />
					<CalcButton text="6" onPress={() => handlePress('6')} />
					<CalcButton text="×" onPress={() => handlePress('×')} />

					<CalcButton text="1" onPress={() => handlePress('1')} />
					<CalcButton text="2" onPress={() => handlePress('2')} />
					<CalcButton text="3" onPress={() => handlePress('3')} />
					<CalcButton text="-" onPress={() => handlePress('-')} />

					<CalcButton text="C" onPress={() => handlePress('C')} />
					<CalcButton text="back" onPress={() => handlePress('back')} />
					<CalcButton text="0" onPress={() => handlePress('0')} />
					<CalcButton text="+" onPress={() => handlePress('+')} />

					<CalcButton text="=" onPress={() => handlePress('=')} isEqual isDouble />
					<CalcButton text="Done" onPress={() => onClose(expression)} isDone isDouble />
				</View>
			</LinearGradient>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: { justifyContent: 'flex-end', margin: 0 },
	container: {
		borderTopLeftRadius: radius._30,
		borderTopRightRadius: radius._30,
		paddingBottom: verticalScale(Platform.OS === 'ios' ? 40 : 40),
		minHeight: SCREEN_HEIGHT * 0.55,
	},
	handle: {
		width: scale(40),
		height: scale(5),
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		borderRadius: radius._10,
		alignSelf: 'center',
		marginVertical: spacingX._15,
	},
	displayWrapper: {
		marginHorizontal: spacingX._20,
		marginBottom: spacingX._20,
	},
	displayInner: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		paddingHorizontal: spacingX._20,
		alignItems: 'flex-end',
		borderRadius: radius._12,
		height: verticalScale(60),
		justifyContent: 'center',
		overflow: 'hidden',
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: spacingX._20,
		justifyContent: 'space-between',
		width: '100%',
	},
	buttonWrapper: {
		width: '23%',
		marginVertical: scale(8),
	},
	buttonDouble: {
		width: '48%',
	},
});

export default CalculatorModal;
