import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { Button } from 'react-native-elements';

import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

import { cameraStyles, colors, detailStyles } from './Styles';
import { getDataModel } from './DataModel';

export class CameraScreen extends React.Component {

  constructor(props) {
    super(props);
    this.dataModel = getDataModel();

    this.currentUser = this.props.route.params.currentUser;
    this.currentRecipe = this.props.route.params.currentRecipe;
    // console.log("in camera screen, currentRecipe =", this.currentRecipe);

    this.state = {
      hasCameraPermission: false,
      type: Camera.Constants.Type.back,
    };  
  }

  componentDidMount() {
    this.getPermissions();
  }

  getPermissions = async () => {
    let cameraPerms = await Permissions.askAsync(Permissions.CAMERA);

    let permGranted = cameraPerms.status === 'granted';
    this.setState({
      hasCameraPermission: permGranted
    });
  }

  onTakePicture = async () => {
    let picData = await this.cameraRef.takePictureAsync();
    // console.log(picData);
    // console.log(this.currentRecipe.key);
    // let imageObj = await this.dataModel.addRecipeImage(picData);
    this.dataModel.updateImage(this.currentRecipe, picData);
    // console.log(imageObj);
    this.props.navigation.goBack();
    // this.props.navigation.navigate("Details", {
    //     imageObj: imageObj,
    // });;
    //console.log('took picture!', picData);
  }

//   handleTakePicture = async () => {
//     let picData = await this.camera.takePictureAsync();
//     console.log('took picture again!', picData);
//     this.dataModel.addRecipeImage(this.currentRecipe, picData);
//     this.dataModel.updateImage(picData);
//     this.props.navigation.goBack();
//   }

  setupCamera = async (cameraRef) => { 
    this.camera = cameraRef;
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={detailStyles.cameraContainer}>
        {this.state.hasCameraPermission ?
          <View style={{flex: 1}}>
            <Camera 
              style={detailStyles.camera}
              ratio='4:3'
              pictureSize='Medium'
              ref={ref=>this.cameraRef=ref}
            />
            <TouchableOpacity 
              style={detailStyles.cameraControls}
              onPress={this.onTakePicture}>
              <Text style={detailStyles.snapText}>Take a Picture!</Text>
            </TouchableOpacity>
          </View>
        :
          <Text>
            No access to camera.
          </Text>
        }   
      </View>
      );
    }
  }
}