import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { globalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import { useRef, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

const Login = () => {
	const emailRef = useRef('');
	const passwordRef = useRef('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { login: loginUser } = useAuth();

	const handleSubmit = async () => {
		if (!emailRef.current || !passwordRef.current) {
			Alert.alert('Login', 'Please fill all the fields');
			return;
		}
		setIsLoading(true);
		const res = await loginUser(emailRef.current, passwordRef.current);
		setIsLoading(false);
		if (!res.success) {
			const errorMessage = res.msg || res.msg || 'Something went wrong';
			Alert.alert('Login Error', errorMessage);
		}
	};

	return (
		<ScreenWrapper>
			<View style={globalStyles.authContainer}>
				<BackButton iconSize={28} />

				<View style={{ gap: 5, marginTop: 20 }}>
					<Typo size={30} fontWeight={'800'}>
						Хей,
					</Typo>
					<Typo size={30} fontWeight={'800'}>
						Ласкаво просимо назад
					</Typo>
				</View>

				<View style={globalStyles.authForm}>
					<Typo size={16} color={colors.textLighter}>
						Увійдіть, щоб відстежувати свої витрати
					</Typo>

					<Input
						placeholder="Введіть свою ел. адресу"
						keyboardType="email-address"
						autoCapitalize="none"
						textContentType="emailAddress"
						onChangeText={(value) => (emailRef.current = value)}
						icon={<Icons.At size={26} color={colors.neutral300} weight="fill" />}
					/>

					<Input
						placeholder="Введіть свій пароль"
						onChangeText={(value) => (passwordRef.current = value)}
						secureTextEntry
						icon={<Icons.Lock size={26} color={colors.neutral300} weight="fill" />}
					/>

					<Typo size={14} color={colors.text} style={{ alignSelf: 'flex-end' }}>
						Забули пароль?
					</Typo>

					<Button loading={isLoading} onPress={handleSubmit}>
						<Typo fontWeight={'700'} color={colors.primaryLight} size={21}>
							Вхід
						</Typo>
					</Button>
				</View>

				<View style={globalStyles.authFooter}>
					<Typo size={15}>Немає облікового запису?</Typo>
					<Pressable onPress={() => router.push('/(auth)/register')}>
						<Typo size={15} fontWeight={'700'} color={colors.primaryLight}>
							Зареєструватися
						</Typo>
					</Pressable>
				</View>
			</View>
		</ScreenWrapper>
	);
};

export default Login;
