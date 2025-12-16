import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExampleCard } from "../../components/ExampleCard";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Expo ThreeJS Demo</Text>
          <Text style={styles.headerSubtitle}>Explore 3D Examples</Text>
        </View>

        <ExampleCard
          title="Audio Particles"
          description="Sound-reactive particle system"
          href="/audioParticles"
          colors={["#FF9A9E", "#FECFEF", "#FECFEF"]}
          icon="musical-notes"
        />

        <ExampleCard
          title="Sample Mesh"
          description="Basic mesh rendering example"
          href="/sampleMesh"
          colors={["#a18cd1", "#fbc2eb"]}
          icon="cube"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA", // Light greyish blue background
  },
  scrollContent: {
    padding: 16,
    alignItems: "center",
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
});
