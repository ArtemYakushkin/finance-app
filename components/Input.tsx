import { INPUT_GRADIENT } from '@/constants/gradient';
import { SHADOW_INPUT_AUTH } from '@/constants/shadow';
import { colors } from '@/constants/theme';
import { globalStyles } from '@/styles/global';
import { InputProps } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

const Input = (props: InputProps) => {
	return (
		<View style={[props.containerStyle, { alignSelf: 'stretch' }]}>
			<View style={globalStyles.inputBaseBackground}>
				<Shadow {...SHADOW_INPUT_AUTH.light} style={{ alignSelf: 'stretch' }}>
					<Shadow {...SHADOW_INPUT_AUTH.dark} style={{ alignSelf: 'stretch' }}>
						<LinearGradient {...INPUT_GRADIENT} style={globalStyles.inputContainer}>
							<View style={globalStyles.inputContent}>
								{props.icon && props.icon}
								<TextInput
									style={[globalStyles.input, props.inputStyle]}
									placeholderTextColor={colors.neutral400}
									cursorColor={colors.primary}
									{...props}
								/>
							</View>
						</LinearGradient>
					</Shadow>
				</Shadow>
			</View>
		</View>
	);
};

export default Input;
