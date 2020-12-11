import React from 'react';
import { TextInput, Text, View, 
  FlatList, TouchableOpacity, Alert, KeyboardAvoidingView } 
  from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { peopleStyles, colors } from './Styles';
import { getDataModel } from './DataModel';
import { loginStyles } from './Styles';

export class AddRecipeNameScreen extends React.Component {
    constructor(props) {
        super(props);
    
        this.dataModel = getDataModel();
        this.currentRecipe = this.props.route.params.currentRecipe;
    
        this.state = {
          nameInput: '',
          descriptionInput:'',
          ingredientsInput: '',
          processInput: []
        }
      }

    onUpdateRecipe = async () => {
    console.log(this.id);
    let thisRecipe = await this.dataModel.updateRecipe(
        this.currentRecipe.key,
        this.state.nameInput,
        this.state.descriptionInput,
        this.state.ingredientsInput,
        this.state.processInput
        //this.state.passwordInput,
        //this.state.displayNameInput
    );
    this.props.navigation.navigate('Recipes');
    // this.props.navigation.navigate("Details", {
    //     currentRecipe: thisRecipe
    // });
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
                    >Name your awesome recipe:</Text>
                    <TextInput
                    style={loginStyles.inputText}
                    keyboardType='default'
                    autoCapitalize='sentences'
                    autoCorrect={true}
                    autoCompleteType='name'
                    textContentType='name'
                    value={this.state.nameInput}
                    onChangeText={(text)=>{this.setState({nameInput: text})}}
                    />
                    <TouchableOpacity 
                    style={loginStyles.buttonContainer}
                    onPress={this.onUpdateRecipe}
                    >
                    <Text style={loginStyles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </KeyboardAvoidingView>
        )
      }



}