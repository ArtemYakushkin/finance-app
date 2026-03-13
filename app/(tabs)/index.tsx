import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { auth } from '@/config/firebase';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { signOut } from 'firebase/auth';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Home = () => {
	const { user } = useAuth();

	const handleLogout = async () => {
		await signOut(auth);
	};

	return (
		<ScreenWrapper>
			<Typo>Home</Typo>
			<Button onPress={handleLogout}>
				<Typo fontWeight={'700'} color={colors.primaryLight} size={21}>
					Logout
				</Typo>
			</Button>
		</ScreenWrapper>
	);
};

export default Home;

const styles = StyleSheet.create({});
