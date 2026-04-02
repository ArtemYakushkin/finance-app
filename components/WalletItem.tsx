import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { WalletType } from '@/types';
import { verticalScale } from '@/utils/styling';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Router } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Typo from './Typo';

const WalletItem = ({
	item,
	index,
	router,
}: {
	item: WalletType;
	index: number;
	router: Router;
}) => {
	const openWallet = () => {
		router.push({
			pathname: '/(modals)/walletModal',
			params: { id: item?.id, name: item?.name, image: item?.image },
		});
	};
	return (
		<Animated.View entering={FadeInDown.delay(index * 200).springify()}>
			<Pressable onPress={openWallet}>
				<BlurView intensity={25} tint="dark" style={styles.container}>
					<View style={styles.imageContainer}>
						<Image
							style={{ flex: 1 }}
							source={item?.image}
							contentFit="cover"
							transition={100}
						/>
					</View>
					<View style={styles.nameContainer}>
						<Typo size={16}>{item?.name}</Typo>
						<Typo size={14} color={colors.neutral400}>
							${item?.amount}
						</Typo>
					</View>
					<Icons.CaretRight
						size={verticalScale(20)}
						weight="bold"
						color={colors.white}
					/>
				</BlurView>
			</Pressable>
		</Animated.View>
	);
};

export default WalletItem;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: verticalScale(17),
		padding: spacingY._12,
		backgroundColor: 'rgba(41, 46, 58, 0.07)',
		borderRadius: radius._17,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.1)',
	},
	imageContainer: {
		height: verticalScale(45),
		width: verticalScale(45),
		overflow: 'hidden',
	},
	nameContainer: {
		flex: 1,
		gap: 2,
		marginLeft: spacingX._10,
	},
});
