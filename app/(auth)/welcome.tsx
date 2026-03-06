import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const welcome = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <TouchableOpacity style={styles.loginButton}>
            <Typo fontWeight={"500"}>Sign in</Typo>
          </TouchableOpacity>

          <Animated.Image
            entering={FadeIn.duration(2000)}
            source={require("../../assets/images/welcom-img.png")}
            style={styles.welcomeImage}
            // resizeMode="contain"
          />
        </View>

        <View style={styles.footer}>
          <View style={{ alignItems: "center" }}>
            <Typo size={30} fontWeight={"800"}>
              Always take control
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              of your finances
            </Typo>
          </View>

          <View style={styles.buttonContainer}>
            <Button>
              <Typo size={22} color={colors.neutral800} fontWeight={"700"}>
                Get started
              </Typo>
            </Button>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(450),
    alignSelf: "center",
    marginTop: verticalScale(30),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingX._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});
