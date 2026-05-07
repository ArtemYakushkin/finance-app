import { colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
	// ----HomePage----

	container: {
		flex: 1,
		paddingHorizontal: 15,
	},

	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},

	searchIcon: {
		backgroundColor: colors.gradientStart,
		padding: 10,
		borderRadius: 50,
		borderColor: colors.neutral200,
		borderWidth: 1,
	},

	scrollViewStyle: {
		marginTop: 10,
		paddingBottom: 100,
		gap: 25,
	},

	addButton: {
		height: 50,
		width: 50,
		borderRadius: 100,
		position: 'absolute',
		bottom: 30,
		right: 20,
	},
});
