import { ActivityIndicator, View } from "react-native";

export default function SSOCallback() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
      }}
    >
      <ActivityIndicator size="large" color="#FFB347" />
    </View>
  );
}
