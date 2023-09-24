import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import Tasks from './Tasks';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'tasks';

const HomeScreen = (props) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateText, setSelectedDateText] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksJSON = await AsyncStorage.getItem(STORAGE_KEY);
      if (tasksJSON !== null) {
        const storedTasks = JSON.parse(tasksJSON);
        setTasks(storedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    const formattedDate = date.toLocaleString();
    setSelectedDateText(formattedDate);
  };

  const handleClose = () => {
    setDatePickerVisible(false);

    if (newTaskText.trim() === '') {
      return;
    }

    const newTaskId = tasks.length + 1;
    const newTask = {
      id: newTaskId,
      text: `${newTaskText} (${selectedDateText})`, // Use selectedDateText
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    saveTasks(updatedTasks);

    setNewTaskText('');
  };

  const handleEdit = (taskId, newText) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, text: newText } : task
    );
    setTasks(updatedTasks);

    saveTasks(updatedTasks);
  };

  const handleDelete = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    saveTasks(updatedTasks);
  };

  const handleAddTask = () => {
    if (newTaskText.trim() === '') {
      return;
    }

    const newTaskId = tasks.length + 1;
    const newTask = { id: newTaskId, text: newTaskText };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    saveTasks(updatedTasks);

    setNewTaskText('');
  };

  const handleOpenDatePicker = () => {
    setDatePickerVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Tasks</Text>
      <View style={styles.Wrapper}>
        {tasks.map((task) => (
          <Tasks
            key={task.id}
            text={task.text}
            Date={selectedDateText} // Use selectedDateText instead of selectedDate
            onEdit={(newText) => handleEdit(task.id, newText)}
            onDelete={() => handleDelete(task.id)}
          />
        ))}
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.taskWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          onChangeText={(text) => setNewTaskText(text)}
          value={newTaskText}
        />
        <TouchableOpacity onPress={handleOpenDatePicker}>
          <View>
            <Image
              style={styles.datePickerIcon}
              source={require('../assets/Calendar.png')}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
            <Image
              style={styles.addIcon}
              source={require('../assets/Add.png')}
            />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDatePickerVisible}
        onRequestClose={handleClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.modalTitle}>Select Date and Time</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}>
                <Image
                  source={require('../assets/Close.png')}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
            <DatePicker
              mode="datetime"
              date={selectedDate}
              onDateChange={handleDateChange}
            />
            <TouchableOpacity
              onPress={handleClose}
              style={styles.modalSaveButton}>
              <Text style={styles.modalSaveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#221738',
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontFamily: 'serif',
    padding: 20,
    fontWeight: 'bold',
  },
  taskWrapper: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },

  closeButton: {
    position: 'absolute',
    top: -10,
    right:-10,
  },

  closeIcon: {
    width: 24,
    height: 24,
  },

  input: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  Wrapper: {
    padding: 5.8,
  },
  addWrapper: {
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  datePickerIcon: {
    width: 30,
    height: 30,
    position: 'relative',
    right: 30,
  },
  addIcon: {
    width: 20,
    height: 20,
  },
  swipeButton: {
    width: 80,
    height: 50,
    justifyContent: 'space-between',
    borderRadius: 10,
    alignItems: 'center',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ED1C24',
  },
  modalSaveButton: {
    backgroundColor: '#0A5CEB',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalSaveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
