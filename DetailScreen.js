import React from 'react';
import { TextInput, Text, View, 
  FlatList, Image, TouchableOpacity, Alert, KeyboardAvoidingView } 
  from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Ionicons } from '@expo/vector-icons';
import { peopleStyles, recipeStyles, colors } from './Styles';
import { getDataModel } from './DataModel';
import { loginStyles } from './Styles';
import { detailStyles } from './Styles';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';

export class DetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.operation = this.props.route.params.operation;
    this.currentRecipe = this.props.route.params.currentRecipe;
    this.currentUser = this.props.route.params.currentUser;
    this.dataModel = getDataModel();
    this.dataModel.subscribeToImageUpdate(this.onImageUpdate);
    // console.log('current recipe:', this.currentRecipe);
    // console.log(this.currentRecipe.key);
    // console.log(this.props.route.params.currentRecipe.name.toString())
    // this.recipes = this.props.route.params.recipes;
    // console.log(this.props.route.params.recipes);
    // console.log(this.recipes);
   
    // this.imageWidth = 70,
    // this.imageHeight = 100;

    let nameInit = '';
    let descriptionInit = '';
    let ingredientsInit = '';
    let processInit = '';
    if (this.operation === 'edit') {
      nameInit = this.currentRecipe.name.toString();
      descriptionInit = this.props.route.params.currentRecipe.description.toString();
      ingredientsInit = this.props.route.params.currentRecipe.ingredients.toString();
      processInit = this.props.route.params.currentRecipe.process.toString();
    }

    this.state = {
      // recipes: [],
      theImage: require('./assets/logo.png'), // placeholder
      nameInput: nameInit,
      descriptionInput: descriptionInit,
      ingredientsInput: ingredientsInit,
      processInput: processInit,
    }
  }

  onImageUpdate = (imageObject) => {
    this.setState({
      theImage: imageObject
    });
    // console.log('testingImage', theImage)
  }

  // onTakePicture = () => {
  //   this.props.navigation.navigate("Camera", {
  //     currentRecipe: this.currentRecipe,
  //   })
  // }

  // componentDidMount = () => {
  //   //instead of loading messages once, we will subscribe to message updates
  //   this.subscribeToRecipes();
  // }


  // subscribeToRecipes = async() => {

  //   // call getRecipes and capture the result in this.recipes
  //   this.recipes = await this.dataModel.getRecipes();


  //   // when we subscribe, we will receive an update right away
  //   // and anytime there's a change thereafter. So we don't want to setState()
  //   // here but when we get the updates
  //   this.dataModel.subscribeToRecipes(this.recipes, this.onRecipesUpdate);
  // }


  // onRecipesUpdate = () => {
  //   console.log('got recipes update', this.recipes);
  //   this.setState({recipes: this.recipes});
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
            style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} 
            behavior="padding" enabled   
            keyboardVerticalOffset={100}
            >
            <ScrollView>
            <View style={detailStyles.topView}>   
              <View style={detailStyles.inputRow}>         
              <Text 
                    style={detailStyles.inputLabel}
                    >Recipe Name</Text>
                    <TextInput
                    style={detailStyles.inputText}
                    keyboardType='default'
                    autoCapitalize='sentences'
                    placeholder='Enter recipe name'
                    autoCorrect={true}
                    autoCompleteType='name'
                    textContentType='name'
                    value={this.state.nameInput}
                    onChangeText={(text)=>{this.setState({nameInput: text})}}
                    />
                    </View>  
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
                        this.props.navigation.navigate('Camera', 
                        {
                          currentRecipe: this.currentRecipe,
                          currentUser: this.currentUser
                        }
                        );
                      }}
                    />
                  <Text 
                  style={detailStyles.inputLabel}
                  >Ingredients</Text>
                  <TextInput
                  style={detailStyles.inputText}
                  placeholder='Enter ingredients'
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
                  placeholder='Enter description'
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
              style={loginStyles.buttonContainer}
              onPress={()=>{
                this.props.navigation.goBack();
              }}>
              <Text style={detailStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
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
                          key: -1 // placeholder for "no ID"
                        }
                      } else { // operation === 'edit'
                        theRecipe = this.props.route.params.currentRecipe;
                        theRecipe.name = this.state.nameInput;
                        theRecipe.description = this.state.descriptionInput;
                        theRecipe.ingredients = this.state.ingredientsInput;
                        theRecipe.process = this.state.processInput;
                      }
                      this.props.navigation.navigate("Recipes", {
                        operation: this.operation,
                        recipe: theRecipe
                      });
                    }}
                    >
                    <Text style={detailStyles.buttonText}>Save</Text>
                    </TouchableOpacity>
            </View>
            </ScrollView>
            </KeyboardAvoidingView>
    )
  }
}