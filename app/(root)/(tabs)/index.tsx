import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className=" font-bold text-2xl text-blue-600">HALO BIRU</Text>
      <Link href={"/sign-in"}>Sign In </Link>
      <Link href={"/explore"}>Explore </Link>
      <Link href={"/profile"}>Profile </Link>
      <Link href={"/properties/1"}>Property </Link>
      
    </View>
  );
}
