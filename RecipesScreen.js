import React from 'react';
import { TextInput, Text, View, 
  FlatList, TouchableOpacity, Alert } 
  from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { peopleStyles, colors } from './Styles';
import { getDataModel } from './DataModel';

export class RecipesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();
    this.currentUser = this.props.route.params.currentUser;

    let allRecipes = this.dataModel.getRecipes();

    this.state = {
      recipes: allRecipes,
      nameInput: '',
      descriptionInput:'',
      ingredientsInput: '',
      processInput: []
      //displayNameInput: '',
      //passwordInput: '',
    }
  }

  onCreateRecipe = async () => {
    let newRecipe = await this.dataModel.createRecipe(
      this.state.nameInput,
      this.state.descriptionInput,
      this.state.ingredientsInput,
      this.state.processInput
      //this.state.passwordInput,
      //this.state.displayNameInput
    );
    this.props.navigation.navigate("AddRecipeName", {
      currentRecipe: newRecipe
    });
  }

  onDeleteRecipe = async(key) => {
    this.dataModel.deleteRecipe(key);
    let {recipes} = this.state.recipes;
    let foundIndex = -1;
    for (let idx in recipes) {
      if (recipes[idx].key === key) {
        foundIndex = idx;
        break;
      }
    }
    if (foundIndex !== -1) { // silently fail if item not found
      recipes.splice(foundIndex, 1); // remove one element 
    }
    this.setState({recipes: recipes});
  }


  render() {
    return (
      <View style={peopleStyles.container}>
        <View style={peopleStyles.peopleListContainer}>
          <FlatList
            ItemSeparatorComponent={()=>{
              return (
                <View style={peopleStyles.separator}/>
              );
            }}
            data={this.state.recipes}
            renderItem={({item})=> {
              return (
                <View>
                  <View>
                    <TouchableOpacity 
                      // style={styles.footerButton}
                      onPress={()=>{this.props.navigation.navigate("Details")}}>
                      <Text style={peopleStyles.personText}>{item.name} </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => {this.onDeleteRecipe(item.key)}}>
                      <Ionicons name="md-trash" 
                      size={24} 
                      color={colors.primaryDark} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
          <View>
            <TouchableOpacity onPress={this.onCreateRecipe}>
              <Ionicons name="md-add-circle" 
              size={80} 
              color={colors.primaryDark} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}