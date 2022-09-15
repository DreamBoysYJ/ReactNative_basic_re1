import { StatusBar } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Fontisto } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState();
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  const [done, setDone] = useState(false);

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    console.log(s);
    s !== null ? setToDos(JSON.parse(s)) : null;
  };

  const travel = async () => {
    setWorking(false);
    console.log(`1 : ${working}`);
    await AsyncStorage.removeItem("@tab");
    await AsyncStorage.setItem("@tab", JSON.stringify(working));
    console.log(`2 : ${working}`);
  };

  const work = async () => {
    setWorking(true);
    console.log(working);
    await AsyncStorage.removeItem("@tab");
    await AsyncStorage.setItem("@tab", JSON.stringify(working));
    console.log(working);
  };
  const onChangeText = (payload) => setText(payload);
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, ["clear"]: false },
    };
    console.log(newToDos);
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDos = (key) => {
    if (Platform.OS === "web") {
      const ok = confirm("Do you want to Delete?");
      if (ok) {
        const newToDos = { ...toDos };
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    } else {
      Alert.alert("Delete To Do", "Are you sure?", [
        { text: "취소" },
        {
          text: "확인",
          style: "destructive",
          onPress: () => {
            const newToDos = { ...toDos };
            delete newToDos[key];
            setToDos(newToDos);
            saveToDos(newToDos);
          },
        },
      ]);
    }
  };

  async function getState() {
    const t = await AsyncStorage.getItem("@tab");
    const tabState = JSON.parse(t);
    if (tabState === null) {
      return setWorking(true);
    }
    tabState ? setWorking(true) : setWorking(false);
  }

  useEffect(() => {
    console.log("refreshed");
    getState();
    loadToDos();
    console.log(working);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        returnKeyType="done"
        blurOnSubmit
        onChangeText={onChangeText}
        value={text}
        placeholder={
          working ? "What do you have to do? " : "Where do you want to go?"
        }
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <TouchableOpacity
              key={key}
              onPress={() => setDone((prev) => !prev)}
            >
              <View style={styles.toDo} key={key}>
                <Text
                  style={{
                    ...styles.toDoText,
                    textDecorationLine: done ? "line-through" : null,
                    color: done ? "green" : "white",
                  }}
                >
                  {toDos[key].text}
                </Text>
                <TouchableOpacity onPress={() => deleteToDos(key)}>
                  <Fontisto name="trash" size={23} color="tomato" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.toDoBg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },
});
