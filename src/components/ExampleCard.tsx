import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface ExampleCardProps {
  title: string;
  description?: string;
  href: string;
  colors?: [string, string, ...string[]];
  icon?: keyof typeof Ionicons.glyphMap;
}

export const ExampleCard: React.FC<ExampleCardProps> = ({
  title,
  description,
  href,
  colors = ["#4c669f", "#3b5998", "#192f6a"],
  icon = "cube-outline",
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(href as any);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={styles.container}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <BlurView intensity={20} tint="light" style={styles.blurContainer}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={32} color="white" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              {description && (
                <Text style={styles.description}>{description}</Text>
              )}
            </View>
            <View style={styles.arrowContainer}>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="rgba(255,255,255,0.8)"
              />
            </View>
          </View>
        </BlurView>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: 120, // Fixed height for consistency
    marginVertical: 10,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    overflow: "hidden", // Ensure gradient/blur respects border radius
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  arrowContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
