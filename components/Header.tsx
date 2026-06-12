import { globalStyles } from '@/styles/global';
import { HeaderProps } from '@/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Typo from './Typo';

const Header = ({ title = '', leftIcon, style }: HeaderProps) => {
	return (
		<View style={[globalStyles.headerTop, style]}>
			{leftIcon && <View style={globalStyles.headerIcon}>{leftIcon}</View>}
			{title && (
				<Typo
					size={22}
					fontWeight={'600'}
					style={{
						textAlign: 'center',
						width: leftIcon ? '82%' : '100%',
					}}
				>
					{title}
				</Typo>
			)}
		</View>
	);
};

export default Header;
