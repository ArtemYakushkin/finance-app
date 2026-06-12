import { colors } from '@/constants/theme';
import { TypoProps } from '@/types';
import { Text, TextStyle } from 'react-native';

const Typo = ({ size, color = colors.text, fontWeight = '400', children, style, textProps = {} }: TypoProps) => {
	const textStyle: TextStyle = {
		fontSize: size ? size : 18,
		color,
		fontWeight,
	};
	return (
		<Text style={[textStyle, style]} {...textProps}>
			{children}
		</Text>
	);
};

export default Typo;
