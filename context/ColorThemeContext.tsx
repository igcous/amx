import React, { createContext, useContext, PropsWithChildren } from "react";
import { Colors } from "../constants/colorPalette";
import { useColorScheme } from "react-native";

type ColorTheme = {
	primary: string;
	secondary: string;
	tertiary: string;
	background: string;
	textPrimary: string;
	textSecondary: string;
};

const light: ColorTheme = {
	primary: Colors.col1,
	secondary: Colors.col2,
	tertiary: Colors.col3,
	background: Colors.col4,
	textPrimary: Colors.col5,
	textSecondary: Colors.col1,
};

// TODO
const dark: ColorTheme = {
	primary: Colors.col1,
	secondary: Colors.col2,
	tertiary: Colors.col3,
	background: Colors.col4,
	textPrimary: Colors.col5,
	textSecondary: Colors.col1,
};

/*interface ColorThemeContextType {
	light: ColorTheme;
	dark: ColorTheme;
}*/

const ColorThemeContext = createContext<ColorTheme>(light); // default?

export const ColorThemeProvider = ({ children }: PropsWithChildren) => {
	const colorScheme = useColorScheme();
	return (
		<ColorThemeContext.Provider value={colorScheme === "light" ? light : dark}>
			{children}
		</ColorThemeContext.Provider>
	);
};

export const useColorTheme = () => {
	const context = useContext(ColorThemeContext);
	if (!context) {
		throw new Error("useColorTheme must be used within an ColorThemeProvider");
	}
	return context;
};
