import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <LinearGradient
      colors={["#0f172a", "#1d4ed8", "#2563eb"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🏗️</Text>
          </View>

          <Text style={styles.appName}>BuildFlow</Text>

          <Text style={styles.appLabel}>
            WORKER APP
          </Text>

          <View style={styles.loadingContainer}>
            <View style={styles.loadingDot} />
            <Text style={styles.loadingText}>
              Loading...
            </Text>
          </View>

        </View>

        <Text style={styles.footer}>
          Construction Workforce Management
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 28,

    backgroundColor: "rgba(255,255,255,0.14)",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },

  logo: {
    fontSize: 48,
  },

  appName: {
    marginTop: 20,

    color: "#ffffff",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  appLabel: {
    marginTop: 6,

    color: "#bfdbfe",
    fontSize: 11,
    fontWeight: "800",

    letterSpacing: 3,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 35,
  },

  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,

    backgroundColor: "#ffffff",

    marginRight: 9,
  },

  loadingText: {
    color: "#dbeafe",
    fontSize: 12,
    fontWeight: "600",
  },

  footer: {
    paddingBottom: 22,

    color: "#bfdbfe",
    fontSize: 10,
    textAlign: "center",
  },
});