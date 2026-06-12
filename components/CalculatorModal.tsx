import { MAIN_GRADIENT } from '@/constants/gradient';
import { colors } from '@/constants/theme';
import { globalStyles } from '@/styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Dimensions, View } from 'react-native';
import Modal from 'react-native-modal';
import CalcButton from './CalcButton';
import Typo from './Typo';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CalculatorProps {
	isVisible: boolean;
	onClose: (value: string) => void;
	initialValue: string;
}

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
			style={globalStyles.calcModal}
			backdropOpacity={0.6}
			deviceHeight={SCREEN_HEIGHT}
			statusBarTranslucent
		>
			<LinearGradient {...(MAIN_GRADIENT as any)} style={globalStyles.calcContainer}>
				<View style={globalStyles.calcHandle} />

				<View style={globalStyles.calcDisplayWrapper}>
					<View style={globalStyles.calcDisplayInner}>
						<Typo size={32} fontWeight="700" color={colors.white}>
							{expression}
						</Typo>
					</View>
				</View>

				<View style={globalStyles.calcGrid}>
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

export default CalculatorModal;
