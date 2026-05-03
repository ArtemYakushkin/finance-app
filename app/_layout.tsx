import { AuthProvider } from '@/context/authContext';
import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

const StackLayout = () => {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="(modals)/profileModal"
				options={{
					gestureEnabled: true,
					gestureDirection: 'vertical',
					contentStyle: {
						borderTopLeftRadius: Platform.OS === 'android' ? 30 : 0,
						borderTopRightRadius: Platform.OS === 'android' ? 30 : 0,
						marginTop: Platform.OS === 'android' ? 40 : 0,
						overflow: 'hidden',
					},
					presentation: 'transparentModal',
					animation: 'fade_from_bottom',
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="(modals)/walletModal"
				options={{
					gestureEnabled: true,
					gestureDirection: 'vertical',
					contentStyle: {
						borderTopLeftRadius: Platform.OS === 'android' ? 30 : 0,
						borderTopRightRadius: Platform.OS === 'android' ? 30 : 0,
						marginTop: Platform.OS === 'android' ? 40 : 0,
						overflow: 'hidden',
					},
					presentation: 'transparentModal',
					animation: 'fade_from_bottom',
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="(modals)/transactionModal"
				options={{
					gestureEnabled: true,
					gestureDirection: 'vertical',
					contentStyle: {
						borderTopLeftRadius: Platform.OS === 'android' ? 30 : 0,
						borderTopRightRadius: Platform.OS === 'android' ? 30 : 0,
						marginTop: Platform.OS === 'android' ? 40 : 0,
						overflow: 'hidden',
					},
					presentation: 'transparentModal',
					animation: 'fade_from_bottom',
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="(modals)/searchModal"
				options={{
					gestureEnabled: true,
					gestureDirection: 'vertical',
					contentStyle: {
						borderTopLeftRadius: Platform.OS === 'android' ? 30 : 0,
						borderTopRightRadius: Platform.OS === 'android' ? 30 : 0,
						marginTop: Platform.OS === 'android' ? 40 : 0,
						overflow: 'hidden',
					},
					presentation: 'transparentModal',
					animation: 'fade_from_bottom',
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="(modals)/settingsModal"
				options={{
					gestureEnabled: true,
					gestureDirection: 'vertical',
					contentStyle: {
						borderTopLeftRadius: Platform.OS === 'android' ? 30 : 0,
						borderTopRightRadius: Platform.OS === 'android' ? 30 : 0,
						marginTop: Platform.OS === 'android' ? 40 : 0,
						overflow: 'hidden',
					},
					presentation: 'transparentModal',
					animation: 'fade_from_bottom',
					headerShown: false,
				}}
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
