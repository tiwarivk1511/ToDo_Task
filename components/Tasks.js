import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Swipeable from 'react-native-swipeable';

const Tasks = (props) => {
  const [editedText, setEditedText] = useState(props.text);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    validateDate(props.Date) ? new Date(props.Date) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  function validateDate(date) {
    return date instanceof Date && !isNaN(date);
  }

  useEffect(() => {
    // Code with side effects (componentWillMount logic) goes here
    // This code will run after the component has mounted
  }, []); // Empty dependency array to mimic componentWillMount

  const handleEdit = () => {
    setModalVisible(true);
    setShowDatePicker(true);
  };

  const handleDateChange = (selectedDate) => {
    setSelectedDate(selectedDate);
  };

  const handleSaveEdit = () => {
    setModalVisible(false);
    props.onEdit(editedText, selectedDate);
  };

  const handleDelete = () => {
    props.onDelete();
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const leftContent = <Text style={styles.leftSwipeText}></Text>;

  const rightButtons = [
    <TouchableOpacity
      key="editButton"
      style={{
        width: 60,
        height: 60,
        backgroundColor: '#7AC3FF',
        justifyContent: 'center',
        marginStart: 25.5,
        alignItems: 'center',
        marginHorizontal: 10,
        borderRadius: 30,
        shadowColor: '#000000',
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
      }}
      onPress={handleEdit}
    >
      <Image source={require('../assets/Edit.png')} style={styles.buttonIcon} />
    </TouchableOpacity>,

    <TouchableOpacity
      key="deleteButton"
      style={{
        width: 60,
        height: 60,
        backgroundColor: '#F08784',
        justifyContent: 'center',
        marginStart: 25.5,
        alignItems: 'center',
        marginHorizontal: 10,
        borderRadius: 30,
        shadowColor: '#000000',
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
      }}
      onPress={handleDelete}
    >
      <Image
        source={require('../assets/trash.png')}
        style={styles.buttonIcon}
      />
    </TouchableOpacity>,
  ];

  return (
    <View style={styles.taskContainer}>
      <Swipeable
        leftContent={leftContent}
        rightButtons={rightButtons}
        useNativeDriver={false}
      >
        <View>
          <Text style={styles.taskText}>{editedText.split(' (')[0]}</Text>
          <Text style={styles.dateTimeTxt}>
            Task assigned: {selectedDate.toLocaleString()}
          </Text>
        </View>
      </Swipeable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Image
                source={require('../assets/Close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Update Task</Text>
            <TextInput
              value={editedText.split(' (')[0]}
              onChangeText={(text) => setEditedText(text)}
              style={styles.modalTextInput}
            />
            <Text style={styles.modalTitle}>Update Task's Schedule</Text>
            {showDatePicker && (
              <DatePicker
                mode="datetime"
                date={selectedDate}
                onDateChange={handleDateChange}
                style={styles.datePicker}
              />
            )}
            <TouchableOpacity
              onPress={handleSaveEdit}
              style={styles.modalSaveButton}
            >
              <Text style={styles.modalSaveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 20,
    marginBottom: 20,
    padding: 20,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  closeIcon: {
    width: 24,
    height: 24,
  },

  taskText: {
    fontFamily: 'serif',
    fontSize: 20,
    color: '#757575',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 10,
  },

  dateTimeTxt: {
    fontFamily: 'serif',
    fontSize: 16,
    color: '#C0C0C0',
    fontStyle: 'italic',
  },

  leftSwipeText: {
    fontFamily: 'serif',
    fontSize: 16,
    color: '#0A5CEB',
    padding: 10,
    alignSelf: 'flex-end',
  },

  buttonIcon: {
    width: 30,
    height: 30,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },

  modalTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalTextInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%',
  },

  modalSaveButton: {
    backgroundColor: '#0A5CEB',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },

  modalSaveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Tasks;
