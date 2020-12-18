import React from 'react';
import { TextInput, Text, View, 
  FlatList, Image, TouchableOpacity, Alert, KeyboardAvoidingView } 
  from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { peopleStyles, recipeStyles, colors } from './Styles';
import { getDataModel } from './DataModel';
import { loginStyles } from './Styles';
import { detailStyles } from './Styles';
import { StatusBar } from 'expo-status-bar';

export class DetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.operation = this.props.route.params.operation;
    this.currentRecipe = this.props.route.params.currentRecipe;
    // console.log("in detail screen, currentRecipe = ", this.currentRecipe);
    this.currentUser = this.props.route.params.currentUser;
    this.dataModel = getDataModel();
    // this.dataModel.subscribeToImage(this.currentRecipe, this.onImageUpdate);
    // this.imageObj = this.props.route.params.imageObj;
    // console.log('current recipe:', this.currentRecipe);
    // console.log(this.currentRecipe.key);
    // console.log(this.props.route.params.currentRecipe.name.toString())
    // this.recipes = this.props.route.params.recipes;
    // console.log(this.props.route.params.recipes);
    // console.log(this.recipes);
   
    this.imageWidth = 70,
    this.imageHeight = 100;

    let nameInit = '';
    let descriptionInit = '';
    let ingredientsInit = '';
    let processInit = '';
    let imageURLInit = '';
    if (this.operation === 'edit') {
      nameInit = this.currentRecipe.name.toString();
      descriptionInit = this.props.route.params.currentRecipe.description.toString();
      ingredientsInit = this.props.route.params.currentRecipe.ingredients.toString();
      processInit = this.props.route.params.currentRecipe.process.toString();
      imageURLInit = this.props.route.params.currentRecipe.imageURL.toString();
    }

    this.state = {
      // recipes: [],
      theImage: require('./assets/logo.png'), // placeholder
      // theImage: {uri: imageURLInit},
      nameInput: nameInit,
      descriptionInput: descriptionInit,
      ingredientsInput: ingredientsInit,
      processInput: processInit,
    }
  }

  componentDidMount = () => {
    this.subscribeToImage();
  }

  subscribeToImage = async() => {
    
    // this.recipe = await this.dataModel.getRecipe(this.currentRecipe);
    // when we subscribe, we will receive an update right away
    // and anytime there's a change thereafter. So we don't want to setState()
    // here but when we get the updates
    this.dataModel.subscribeToImage(this.currentRecipe, this.onImageUpdate);

  }


  onImageUpdate = () => {
    console.log('got recipe update', this.currentRecipe);
    this.setState({theImage: {uri: this.currentRecipe.imageURL}});
  }


  // checkFirebaseImage = () => {
  //   if (this.currentRecipe.imageURL) {
  //     this.setState ({
  //       theImage: {uri: this.currentRecipe.imageURL}
  //     })
  //   }
  // }



  // onImageUpdate = (imageObject) => {

  //   this.setState({
  //     theImage: imageObject
  //   });
  //   // console.log('testingImage', theImage)
  // }

  // onTakePicture = () => {
  //   this.props.navigation.navigate("Camera", {
  //     currentRecipe: this.currentRecipe,
  //   })
  // }

  // componentDidMount = () => {
  //   //instead of loading images once, we will subscribe to image updates
  //   if (this.operation !== 'add') {
  //     this.subscribeToRecipe();
  //   }
  // }




  // subscribeToRecipe = async() => {

  //   // call getRecipes and capture the result in this.recipes
  //   // this.recipe = await this.dataModel.getRecipe();


  //   // when we subscribe, we will receive an update right away
  //   // and anytime there's a change thereafter. So we don't want to setState()
  //   // here but when we get the updates
  //   this.dataModel.subscribeToRecipe(this.currentRecipe, this.onRecipeUpdate);
  // }


  // onRecipeUpdate = () => {
  //   console.log('got recipes update', this.recipe);
  //   this.setState({theImage: this.recipe.images});
  // }

  // onUpdateRecipe = async () => {
  //   // console.log('check recipes', this.recipes); // this is missing the new recipe.
    
  //   let recipe = {
  //     name: this.state.nameInput,
  //     description: this.state.descriptionInput,
  //     ingredients: this.state.ingredientsInput,
  //     process: this.state.processInput
  //   }

  //   // console.log(recipe); // recipe is the new update one.



  //   // console.log('key =', this.currentRecipe.key); // key is undefined.....

  //   await this.dataModel.updateRecipe(this.currentRecipe.key, recipe)

  //   // let recipes = await this.dataModel.updateRecipe(
  //   //     this.currentRecipe.key,
  //   //     this.state.nameInput,
  //   //     this.state.descriptionInput,
  //   //     this.state.ingredientsInput,
  //   //     this.state.processInput
  //   //     //this.state.passwordInput,
  //   //     //this.state.displayNameInput
  //   // );
    
  //   // console.log(this.recipes);


  //   this.props.navigation.navigate("Recipes", {
  //     recipes: this.recipes,
  //   });
  // }

  render() {
    return (
      <KeyboardAvoidingView 
            style={detailStyles.container}
            behavior={"height"}
            keyboardVerticalOffset={10}>

            <View style={detailStyles.topView}>
              {/* <Text>{this.currentRecipe.name}</Text>
              <Text>{this.state.nameInput}</Text>
              <Text>{this.currentRecipe.ingredients}</Text> */}
              
              <Text 
                    style={detailStyles.inputLabel}
                    >Recipe Name</Text>
                    <TextInput
                    style={detailStyles.inputText}
                    keyboardType='default'
                    autoCapitalize='sentences'
                    autoCorrect={true}
                    autoCompleteType='name'
                    textContentType='name'
                    value={this.state.nameInput}
                    onChangeText={(text)=>{this.setState({nameInput: text})}}
                    />
            </View>

            <View style={detailStyles.middleView}>
                <StatusBar style="auto" />
                <View style={detailStyles.inputRow}>
                  <Text style={detailStyles.inputLabel}>Process</Text>
                  <Image
                      style={detailStyles.mainImage}
                      source={this.state.theImage}
                  />
                  
                  <Ionicons 
                      name='ios-camera' 
                      size={44}
                      color={colors.primary}
                      onPress={()=>{
                      let theRecipe = {};
                      if (this.operation === 'add') {
                        theRecipe = {
                          name: this.state.nameInput,
                          description: this.state.descriptionInput,
                          ingredients: this.state.ingredientsInput,
                          process: this.state.processInput,
                          imageURL: this.state.theImage.uri,
                          key: -1 // placeholder for "no ID"
                        }
                      } else { // operation === 'edit'
                        theRecipe = this.props.route.params.currentRecipe;
                        theRecipe.name = this.state.nameInput;
                        theRecipe.description = this.state.descriptionInput;
                        theRecipe.ingredients = this.state.ingredientsInput;
                        theRecipe.process = this.state.processInput;
                        theRecipe.image = this.state.theImage.uri;
                      }
                      this.props.navigation.navigate("Camera", {
                        operation: this.operation,
                        currentRecipe: theRecipe,
                        currentUser: this.currentUser,
                      });
                    }}
                      //   this.props.navigation.navigate('Camera', 
                      //   {
                      //     currentRecipe: this.currentRecipe,
                      //     currentUser: this.currentUser
                      //   }
                      //   );
                      // }}
                    />
                  <Text 
                  style={detailStyles.inputLabel}
                  >Ingredients</Text>
                  <TextInput
                  style={detailStyles.inputText}
                  placeholder='Enter ingredients          '
                  keyboardType='default'
                  autoCapitalize='sentences'
                  autoCorrect={true}
                  autoCompleteType='name'
                  textContentType='name'
                  value={this.state.ingredientsInput}
                  onChangeText={(text)=>{this.setState({ingredientsInput: text})}}
                  />
                  <Text 
                  style={detailStyles.inputLabel}
                  >Descriptions</Text>
                  <TextInput
                  style={detailStyles.inputText}
                  placeholder='Enter description          '
                  keyboardType='default'
                  autoCapitalize='sentences'
                  autoCorrect={true}
                  autoCompleteType='name'
                  textContentType='name'
                  value={this.state.descriptionInput}
                  onChangeText={(text)=>{this.setState({descriptionInput: text})}}
                  />
                </View>
            </View>
            <View style={detailStyles.bottomView}>
              <TouchableOpacity 
                    style={detailStyles.buttonContainer}
                    onPress={()=>{
                      let theRecipe = {};
                      if (this.operation === 'add') {
                        theRecipe = {
                          name: this.state.nameInput,
                          description: this.state.descriptionInput,
                          ingredients: this.state.ingredientsInput,
                          process: this.state.processInput,
                          imageURL: this.state.theImage.uri,
                          key: -1 // placeholder for "no ID"
                        }
                      } else { // operation === 'edit'
                        theRecipe = this.props.route.params.currentRecipe;
                        theRecipe.name = this.state.nameInput;
                        theRecipe.description = this.state.descriptionInput;
                        theRecipe.ingredients = this.state.ingredientsInput;
                        theRecipe.process = this.state.processInput;
                        theRecipe.image = this.state.theImage.uri;
                      }
                      this.props.navigation.navigate("Recipes", {
                        operation: this.operation,
                        recipe: theRecipe,
                        // imageObj: this.imageObj
                      });
                    }}
                    >
                    <Text style={detailStyles.buttonText}>Save</Text>
                    </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
    )
  }
}