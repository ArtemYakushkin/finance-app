import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors } from '@/constants/theme';
import { globalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const welcome = () => {
	const router = useRouter();

	return (
		<ScreenWrapper>
			<View style={globalStyles.welcomeContainer}>
				<View>
					<TouchableOpacity style={globalStyles.welcomeButton} onPress={() => router.push('/(auth)/login')}>
						<Typo fontWeight={'500'} color={colors.primaryLight}>
							Увійти
						</Typo>
					</TouchableOpacity>

					<Animated.Image
						entering={FadeIn.duration(2000)}
						source={require('../../assets/images/welcom-img.png')}
						style={globalStyles.welcomeImage}
					/>
				</View>

				<View style={globalStyles.welcomeFooter}>
					<View style={{ alignItems: 'center' }}>
						<Typo size={30} fontWeight={'800'}>
							Фінанси
						</Typo>
						<Typo size={30} fontWeight={'800'}>
							під контролем
						</Typo>
					</View>

					<View style={globalStyles.welcomeBtnContainer}>
						<Button onPress={() => router.push('/(auth)/register')}>
							<Typo size={26} color={colors.primaryLight} fontWeight={'700'}>
								Почати
							</Typo>
						</Button>
					</View>
				</View>
			</View>
		</ScreenWrapper>
	);
};

export default welcome;
