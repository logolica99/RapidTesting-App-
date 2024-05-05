import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Pressable,
  Button,
} from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "../Contexts/UserContext";

export default function InfoModal({ open, setOpen, infoModalData, setPhoto }) {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        onRequestClose={() => {
          setOpen(false);
        }}
        // onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
        //   setModalVisible(!modalVisible);
        // }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "bold",
                }}
              >
                Result:
              </Text>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "bold",
                  color:
                    infoModalData.predicted_class == "POSITIVE"
                      ? "green"
                      : "red",
                }}
              >
                {infoModalData.predicted_class}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
              }}
            >
              Confidence: {infoModalData.confidence}%
            </Text>

            <View
              style={{
                marginTop: 20,
                width: 200,
              }}
            >
              <Button
                title="Okay"
                onPress={() => {
                  setOpen(false);
                  setPhoto();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    height: "100%",
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    width: "100%",
    backgroundColor: "#00000030",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
