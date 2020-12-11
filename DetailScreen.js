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
      nameInput: this.props.route.params.currentRecipe.name.toString(),
      descriptionInput: this.props.route.params.currentRecipe.description.toString(),
      ingredientsInput: this.props.route.params.currentRecipe.ingredients.toString(),
      processInput: []
    }
  }

  onUpdateRecipe = async () => {
    let recipes = await this.dataModel.updateRecipe(
        this.currentRecipe.key,
        this.state.nameInput,
        this.state.descriptionInput,
        this.state.ingredientsInput,
        this.state.processInput
        //this.state.passwordInput,
        //this.state.displayNameInput
    );
    // console.log(recipes);
    this.props.navigation.navigate("Recipes", {
      recipes: recipes,
    });
  }

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
                  <Ionicons 
                      name='ios-camera' 
                      size={44}
                      color={colors.primary}
                      // onPress={this.onTakePicture}
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