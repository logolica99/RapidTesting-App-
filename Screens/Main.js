import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { UserContext } from "../Contexts/UserContext";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../firebaseConfig";
import axios from "axios";
import InfoModal from "../Components/InfoModal";
import SplashScreenLoading from "../Components/SplashScreenLoading";

export default function Main() {
  const [user, setUser] = useContext(UserContext);
  let cameraRef = useRef();
  const [apiUrl, setApiUrl] = useState("");
  const [validApiUrl, setValidApiUrl] = useState("");
  const [apiCheckButtonText, setApiCheckButtonText] = useState("Check");

  const [infoText, setInfoText] = useState("");

  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalData, setInfoModalData] = useState({});

  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };
    setUser({ ...user, loading: true });
    setInfoText("Uploading Photo..");
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    try {
      const newImageName = new Date().getTime() + ".png";

      const newPhotoFile = await getBlobFroUri(newPhoto.uri);

      const imageUrl = await uploadImage(newPhotoFile, newImageName);
      console.log("url", imageUrl);
      setInfoText("Analyzing Photo..");

      await predictImage(imageUrl);
      setUser({ ...user, loading: false });
    } catch (err) {
      setUser({ ...user, loading: false });
    }
  };

  const predictImage = async (imageUrl) => {
    const response = await axios.post(`${validApiUrl}/predict_coordinates`, {
      image_link: imageUrl,
    });
    console.log(response);
    console.log(response.data);
    setInfoModalData(response.data);
    setInfoModalOpen(true);
  };

  const getBlobFroUri = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    return blob;
  };

  //   function base64ToBlob(base64String, contentType = "") {
  //     const byteCharacters = atob(base64String);
  //     const byteArrays = [];

  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteArrays.push(byteCharacters.charCodeAt(i));
  //     }

  //     const byteArray = new Uint8Array(byteArrays);
  //     return new Blob([byteArray], { type: contentType });
  //   }

  const uploadImage = async (newPhoto, newImageName) => {
    const storage = getStorage();
    const imageRef = ref(storage, `${newImageName}`);

    try {
      const snapshot = await uploadBytes(imageRef, newPhoto);
      const url = await getDownloadURL(snapshot.ref);
      console.log("Image download URL:", url);
      return url; // Return the URL after successful retrieval
    } catch (error) {
      console.error("Error uploading or getting download URL:", error);
      return null; // Return null or handle error differently
    }
  };

  // if (photo) {
  //   let sharePic = () => {
  //     shareAsync(photo.uri).then(() => {
  //       setPhoto(undefined);
  //     });
  //   };

  //   let savePhoto = () => {
  //     MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
  //       setPhoto(undefined);
  //     });
  //   };

  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <Image
  //         style={styles.preview}
  //         source={{ uri: "data:image/jpg;base64," + photo.base64 }}
  //       />
  //       <Button title="Share" onPress={sharePic} />
  //       {hasMediaLibraryPermission ? (
  //         <Button title="Save" onPress={savePhoto} />
  //       ) : undefined}
  //       <Button title="Discard" onPress={() => setPhoto(undefined)} />
  //     </SafeAreaView>
  //   );
  // }

  return (
    <View style={styles.container}>
      <SplashScreenLoading infoText={infoText} />
      <InfoModal
        open={infoModalOpen}
        setOpen={setInfoModalOpen}
        infoModalData={infoModalData}
        setPhoto={setPhoto}
      />

      <View
        style={{
          height: 500,
          width: "100%",
        }}
      >
        {photo ? (
          <Image
            style={styles.preview}
            source={{ uri: "data:image/jpg;base64," + photo.base64 }}
          />
        ) : (
          <Camera
            style={{
              flex: 1,
            }}
            ref={cameraRef}
          >
            <StatusBar style="auto" />
          </Camera>
        )}
        <View style={styles.buttonContainer}>
          <Button style={{}} title="Take Picture" onPress={takePic} />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row", // Arrange elements horizontally
          alignItems: "center", // Align elements vertically in the row
          padding: 10,
        }}
      >
        <TextInput
          style={{
            flex: 1, // Make TextInput fill available space
            marginRight: 10,
            borderWidth: 1,
            borderColor: "gray", // Change this to your desired color
            padding: 10,
            borderRadius: 5,
          }}
          placeholder="Enter API link"
          value={apiUrl}
          onChangeText={(text) => {
            setApiUrl(text);
          }}
        />
        <Button
          disabled={validApiUrl.length > 0}
          title={apiCheckButtonText}
          style={{}}
          color={validApiUrl.length > 0 ? "gray" : ""}
          onPress={() => {
            axios
              .get(apiUrl)
              .then((res) => {
                console.log(res.data);
                if (res.data == "Hello!") {
                  setValidApiUrl(apiUrl);
                  setApiCheckButtonText("Valid!");
                }
              })
              .catch((err) => {});
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100px",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    // alignSelf: "flex-end",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
