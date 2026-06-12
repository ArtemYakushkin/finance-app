import { colors } from '@/constants/theme';
import { getFilePath } from '@/services/imageService';
import { globalStyles } from '@/styles/global';
import { ImageUploadProps } from '@/types';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Typo from './Typo';

const ImageUpload = ({
	file = null,
	onSelect,
	onClear,
	containerStyle,
	imageStyle,
	placeholder = '',
}: ImageUploadProps) => {
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5,
		});

		if (!result.canceled) {
			onSelect(result.assets[0]);
		}
	};

	return (
		<View>
			{!file && (
				<TouchableOpacity
					onPress={pickImage}
					style={[globalStyles.uploadContainer, containerStyle && containerStyle]}
				>
					<Icons.UploadSimple color={colors.neutral200} />
					{placeholder && <Typo size={15}>{placeholder}</Typo>}
				</TouchableOpacity>
			)}

			{file && (
				<View style={[globalStyles.uploadImage, imageStyle && imageStyle]}>
					<Image style={{ flex: 1 }} source={getFilePath(file)} contentFit="cover" transition={100} />
					<TouchableOpacity style={globalStyles.uploadDeleteIcon} onPress={onClear}>
						<Icons.XCircle size={24} color={colors.neutral100} weight="fill" />
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default ImageUpload;
