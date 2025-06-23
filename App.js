import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  // Force dark mode
  const colors = {
    background: '#121212',
    text: '#E0E0E0',
    inputBg: '#1E1E1E',
    button: '#BB86FC',
    border: '#333333',
    placeholder: '#777777',
  };

  const [text, setText] = useState('');
  const [tasks, setTasks] = useState([]);

  // Load persisted tasks
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('TASKS');
      if (saved) setTasks(JSON.parse(saved));
    })();
  }, []);

  // Persist on change
  useEffect(() => {
    AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!text.trim()) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), text, done: false }]);
    setText('');
  };

  const toggleDone = id =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = id => setTasks(prev => prev.filter(t => t.id !== id));

  const renderItem = ({ item }) => (
    <View style={[styles.task, { borderColor: colors.border }]}>
      <TouchableOpacity onPress={() => toggleDone(item.id)}>
        <Text
          style={[
            styles.taskText,
            { color: colors.text },
            item.done && styles.done
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      <Button
        title="Delete"
        onPress={() => deleteTask(item.id)}
        color={colors.button}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Centered Add Bar */}
      <View style={styles.centerWrapper}>
        <View style={[styles.addContainer, { borderColor: colors.border }]}>
          <TextInput
            placeholder="Add a task..."
            placeholderTextColor={colors.placeholder}
            value={text}
            onChangeText={setText}
            style={[
              styles.input,
              { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }
            ]}
          />
          <Button title="Add" onPress={addTask} color={colors.button} />
        </View>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={t => t.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // This wrapper takes full screen and centers its child
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    width: '90%',
  },

  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginRight: 10,
    fontSize: 16,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },

  taskText: {
    fontSize: 18,
  },

  done: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
});
