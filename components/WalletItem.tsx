import { colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { globalStyles } from '@/styles/global';
import { WalletType } from '@/types';
import { getCurrencySymbol } from '@/utils/common';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Router } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Typo from './Typo';

const WalletItem = ({ item, index, router }: { item: WalletType; index: number; router: Router }) => {
	const { user } = useAuth();

	const currencySymbol = getCurrencySymbol(user?.currency);

	const openWallet = () => {
		router.push({
			pathname: '/(modals)/walletModal',
			params: { id: item?.id, name: item?.name, image: item?.image },
		});
	};

	return (
		<Animated.View entering={FadeInDown.delay(index * 200).springify()}>
			<Pressable onPress={openWallet}>
				<BlurView intensity={25} tint="dark" style={globalStyles.walletItem}>
					<View style={globalStyles.walletImage}>
						<Image style={{ flex: 1 }} source={item?.image} contentFit="cover" transition={100} />
					</View>
					<View style={globalStyles.walletName}>
						<Typo size={16}>{item?.name}</Typo>
						<Typo size={14} color={colors.neutral400}>
							{currencySymbol}
							{item?.amount}
						</Typo>
					</View>
					<Icons.CaretRight size={20} weight="bold" color={colors.white} />
				</BlurView>
			</Pressable>
		</Animated.View>
	);
};

export default WalletItem;

const styles = StyleSheet.create({});
