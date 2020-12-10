import React from 'react';
import { TextInput, Text, View, 
  FlatList, Image, TouchableOpacity, Alert, KeyboardAvoidingView } 
  from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { peopleStyles, recipeStyles, colors } from './Styles';
import { getDataModel } from './DataModel';
import { loginStyles } from './Styles';

export class DetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();
    this.currentUser = this.props.route.params.currentUser;
    this.currentRecipe = this.props.route.params.currentRecipe;
   
    this.imageWidth = 225,
    this.imageHeight = 300;

    this.state = {
      nameInput: '',
      descriptionInput:'',
      ingredientsInput: '',
      processInput: []
    }
  }

  onUpdateRecipe = async () => {
    let thisRecipe = await this.dataModel.updateRecipe(
        this.currentRecipe.key,
        this.state.nameInput,
        this.state.descriptionInput,
        this.state.ingredientsInput,
        this.state.processInput
        //this.state.passwordInput,
        //this.state.displayNameInput
    );
    this.props.navigation.navigate("Recipes");
  }

  render() {
    return (
      <KeyboardAvoidingView 
            style={loginStyles.container}
            behavior={"height"}
            keyboardVerticalOffset={10}>

            <View style={loginStyles.middleView}>
                {/* <StatusBar style="auto" /> */}
                <View style={loginStyles.inputRow}>
                  <Text 
                  style={loginStyles.inputLabel}
                  >Recipe Name</Text>
                  <TextInput
                  style={loginStyles.inputText}
                  keyboardType='default'
                  autoCapitalize='sentences'
                  autoCorrect={true}
                  autoCompleteType='name'
                  textContentType='name'
                  value={this.currentRecipe.name}
                  onChangeText={(text)=>{this.setState({nameInput: text})}}
                  />
                  <Text>Process</Text>
                  <Text 
                  style={loginStyles.inputLabel}
                  >Ingredients</Text>
                  <TextInput
                  style={loginStyles.inputText}
                  keyboardType='default'
                  autoCapitalize='sentences'
                  autoCorrect={true}
                  autoCompleteType='name'
                  textContentType='name'
                  value={this.currentRecipe.ingredients}
                  onChangeText={(text)=>{this.setState({ingredientsInput: text})}}
                  />
                  <Text 
                  style={loginStyles.inputLabel}
                  >Descriptions</Text>
                  <TextInput
                  style={loginStyles.inputText}
                  keyboardType='default'
                  autoCapitalize='sentences'
                  autoCorrect={true}
                  autoCompleteType='name'
                  textContentType='name'
                  value={this.currentRecipe.description}
                  onChangeText={(text)=>{this.setState({descriptionInput: text})}}
                  />
                  <TouchableOpacity 
                  style={loginStyles.buttonContainer}
                  onPress={this.onUpdateRecipe}
                  >
                  <Text style={loginStyles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
            </View>
            </KeyboardAvoidingView>
    )
  }
}