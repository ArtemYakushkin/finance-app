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

const Register = () => {
	const emailRef = useRef('');
	const passwordRef = useRef('');
	const nameRef = useRef('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { register: registerUser } = useAuth();

	const handleSubmit = async () => {
		if (!emailRef.current || !passwordRef.current || !nameRef.current) {
			Alert.alert('Sign up', 'Please fill all the fields');
			return;
		}
		setIsLoading(true);
		const res = await registerUser(emailRef.current, passwordRef.current, nameRef.current);
		setIsLoading(false);
		if (!res.success) {
			const errorMessage = res.msg || res.msg || 'Something went wrong';
			Alert.alert('Sign up Error', errorMessage);
		}
	};

	return (
		<ScreenWrapper>
			<View style={globalStyles.authContainer}>
				<BackButton iconSize={28} />

				<View style={{ gap: 5, marginTop: 20 }}>
					<Typo size={30} fontWeight={'800'}>
						Давайте
					</Typo>
					<Typo size={30} fontWeight={'800'}>
						Починати
					</Typo>
				</View>

				<View style={globalStyles.authForm}>
					<Typo size={16} color={colors.textLighter}>
						Створіть обліковий запис для відстеження своїх витрат
					</Typo>

					<Input
						placeholder="Введіть своє ім'я"
						onChangeText={(value) => (nameRef.current = value)}
						icon={<Icons.User size={26} color={colors.neutral300} weight="fill" />}
					/>

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

					<Button loading={isLoading} onPress={handleSubmit}>
						<Typo fontWeight={'700'} color={colors.primaryLight} size={21}>
							Зареєструватися
						</Typo>
					</Button>
				</View>

				<View style={globalStyles.authFooter}>
					<Typo size={15}>Вже маєте обліковий запис?</Typo>
					<Pressable onPress={() => router.push('/(auth)/login')}>
						<Typo size={15} fontWeight={'700'} color={colors.primaryLight}>
							Вхід
						</Typo>
					</Pressable>
				</View>
			</View>
		</ScreenWrapper>
	);
};

export default Register;
