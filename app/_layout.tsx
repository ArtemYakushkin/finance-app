import { AuthProvider } from '@/context/authContext';
import { Stack } from 'expo-router';
import React from 'react';

const StackLayout = () => {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="(modals)/profileModal"
				options={{ presentation: 'modal' }}
			/>
		</Stack>
	);
};

export default function Rootlayout() {
	return (
		<AuthProvider>
			<StackLayout />
		</AuthProvider>
	);
}
