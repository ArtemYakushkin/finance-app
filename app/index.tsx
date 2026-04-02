import ScreenWrapper from '@/components/ScreenWrapper';
import { colors } from '@/constants/theme';
import { Image, StyleSheet, View } from 'react-native';

const index = () => {
	return (
		<ScreenWrapper>
			<View style={styles.container}>
				<Image
					style={styles.logo}
					resizeMode="contain"
					source={require('../assets/images/logo.png')}
				/>
			</View>
		</ScreenWrapper>
	);
};

export default index;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.neutral900,
	},
	logo: {
		height: '20%',
		width: '40%',
		aspectRatio: 1,
	},
});
