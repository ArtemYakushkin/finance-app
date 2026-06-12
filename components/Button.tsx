import { BUTTON_GRADIENT } from '@/constants/gradient';
import { SHADOW_BUTTON } from '@/constants/shadow';
import { globalStyles } from '@/styles/global';
import { CustomButtonProps } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Loading from './Loading';

const Button = ({ style, onPress, loading = false, children }: CustomButtonProps) => {
	if (loading) {
		return (
			<View style={[globalStyles.button, style, { backgroundColor: 'transparent' }]}>
				<Loading />
			</View>
		);
	}

	return (
		<View style={[style, { alignSelf: 'stretch', margin: 5 }]}>
			<Shadow {...SHADOW_BUTTON.light} style={{ borderRadius: 17, alignSelf: 'stretch' }}>
				<Shadow {...SHADOW_BUTTON.dark} style={{ alignSelf: 'stretch' }}>
					<TouchableOpacity
						onPress={onPress}
						activeOpacity={0.9}
						style={{ borderRadius: 17, overflow: 'hidden' }}
					>
						<LinearGradient {...BUTTON_GRADIENT} style={globalStyles.button}>
							{children}
						</LinearGradient>
					</TouchableOpacity>
				</Shadow>
			</Shadow>
		</View>
	);
};

export default Button;

const styles = StyleSheet.create({});
