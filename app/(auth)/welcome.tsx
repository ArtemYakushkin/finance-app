import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, spacingX } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const welcome = () => {
	const router = useRouter();

	return (
		<ScreenWrapper>
			<View style={styles.container}>
				<View>
					<TouchableOpacity
						style={styles.loginButton}
						onPress={() => router.push('/(auth)/login')}
					>
						<Typo fontWeight={'500'} color={colors.primaryLight}>
							Sign in
						</Typo>
					</TouchableOpacity>

					<Animated.Image
						entering={FadeIn.duration(2000)}
						source={require('../../assets/images/welcom-img.png')}
						style={styles.welcomeImage}
					/>
				</View>

				<View style={styles.footer}>
					<View style={{ alignItems: 'center' }}>
						<Typo size={30} fontWeight={'800'}>
							Always take control
						</Typo>
						<Typo size={30} fontWeight={'800'}>
							of your finances
						</Typo>
					</View>

					<View style={styles.buttonContainer}>
						<Button onPress={() => router.push('/(auth)/register')}>
							<Typo
								size={26}
								color={colors.primaryLight}
								fontWeight={'700'}
							>
								Get started
							</Typo>
						</Button>
					</View>
				</View>
			</View>
		</ScreenWrapper>
	);
};

export default welcome;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
	},
	welcomeImage: {
		width: '100%',
		height: verticalScale(450),
		alignSelf: 'center',
		marginTop: verticalScale(30),
	},
	loginButton: {
		alignSelf: 'flex-end',
		marginRight: spacingX._20,
	},
	footer: {
		backgroundColor: colors.neutral900,
		alignItems: 'center',
		paddingTop: verticalScale(30),
		paddingBottom: verticalScale(72),
		gap: spacingX._20,
	},
	buttonContainer: {
		width: '100%',
		paddingHorizontal: spacingX._20,
	},
});
