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

    this.dataModel = getDataModel();
    this.currentUser = this.props.route.params.currentUser;
    this.currentRecipe = this.props.route.params.currentRecipe;
    // console.log(this.props.route.params.currentRecipe.name.toString())
    // this.recipes = this.props.route.params.recipes;
    // console.log(this.props.route.params.recipes);
    // console.log(this.recipes);
   
    this.imageWidth = 225,
    this.imageHeight = 300;

    this.state = {
      recipes: [],
      nameInput: this.props.route.params.currentRecipe.name.toString(),
      descriptionInput: this.props.route.params.currentRecipe.description.toString(),
      ingredientsInput: this.props.route.params.currentRecipe.ingredients.toString(),
      processInput: []
    }
  }

  componentDidMount = () => {
    //instead of loading messages once, we will subscribe to message updates
    this.subscribeToRecipes();
  }

  componentWillUnmount = () => {
    this.dataModel.unsubscribeFromRecipe(this.recipes);
  }

  subscribeToRecipes = async() => {

    // call getRecipes and capture the result in this.recipes
    this.recipes = await this.dataModel.getRecipes();


    // when we subscribe, we will receive an update right away
    // and anytime there's a change thereafter. So we don't want to setState()
    // here but when we get the updates
    this.dataModel.subscribeToRecipes(this.recipes, this.onRecipesUpdate);
  }


  onRecipesUpdate = () => {
    // console.log('got recipes update', this.recipes);
    this.setState({recipes: this.recipes});
  }

  onUpdateRecipe = async () => {
    let recipe = {
      name: this.state.nameInput,
      description: this.state.descriptionInput,
      ingredients: this.state.ingredientsInput,
      process: this.state.processInput
    }
    await this.dataModel.updateRecipe(this.currentRecipe.key, recipe);

    // let recipes = await this.dataModel.updateRecipe(
    //     this.currentRecipe.key,
    //     this.state.nameInput,
    //     this.state.descriptionInput,
    //     this.state.ingredientsInput,
    //     this.state.processInput
    //     //this.state.passwordInput,
    //     //this.state.displayNameInput
    // );
    // // console.log(recipes);
    
    this.props.navigation.navigate("Recipes", {
      recipes: this.state.recipes,
    });
  }

  onTakePicture = () => {
    this.props.navigation.navigate("Camera", {
      recipe: this.currentRecipe,
    })
  }

  render() {
    return (

      // render item to be added :)
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
                  <Ionicons 
                      name='ios-camera' 
                      size={44}
                      color={colors.primary}
                      onPress={this.onTakePicture}
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
                    onPress={this.onUpdateRecipe}
                    >
                    <Text style={detailStyles.buttonText}>Save</Text>
                    </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
    )
  }
}