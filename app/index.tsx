import ScreenWrapper from '@/components/ScreenWrapper';
import { globalStyles } from '@/styles/global';
import { Image, View } from 'react-native';

const index = () => {
	return (
		<ScreenWrapper>
			<View style={globalStyles.mainContainer}>
				<Image style={globalStyles.logo} resizeMode="contain" source={require('../assets/images/logo.png')} />
			</View>
		</ScreenWrapper>
	);
};

export default index;
