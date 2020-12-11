import React from 'react';
import { TextInput, Text, View, 
  FlatList, TouchableOpacity, Alert } 
  from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { recipeStyles, colors } from './Styles';
import { getDataModel } from './DataModel';

export class RecipesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();
    this.currentUser = this.props.route.params.currentUser
    console.log(this.props.route.params.recipe);

    if (this.props.route.params.recipes != undefined ) {
      this.allRecipes = this.props.route.params.recipes
    } else {
      this.allRecipes = this.dataModel.getRecipes();
    }

    this.state = {
      recipes: this.allRecipes,
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
    this.props.navigation.navigate("Details", {
      recipes: this.state.recipes,
      currentRecipe: newRecipe
    });
  }

  onDeleteRecipe = async(key) => {
    this.dataModel.deleteRecipe(key);
    // let recipes = this.dataModel.deleteRecipe(key);
    // this.setState({recipes: recipes})
    // console.log(recipes);
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
      <View style={recipeStyles.container}>
      <View style={recipeStyles.recipeListContainer}>
        <FlatList
          ItemSeparatorComponent={()=>{
            return (
              <View style={recipeStyles.separator}/>
            );
          }}
          data={this.state.recipes}
          renderItem={({item})=> {
            return (
              <View style={recipeStyles.listItemContainer}>
                <View style={recipeStyles.listItemTextContainer}>
                  <TouchableOpacity 
                    onPress={()=>{this.props.navigation.navigate("Details", {
                      currentRecipe: item
                    })}}>
                    <Text style={recipeStyles.listItemText}>{item.name} </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity onPress={() => {this.onDeleteRecipe(item.key)}}>
                    <Ionicons name="md-trash" 
                    size={25} 
                    color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
      <View style={recipeStyles.footer}>
          <TouchableOpacity onPress={this.onCreateRecipe}>
            <Ionicons name="md-add-circle" 
            size={60} 
            color={colors.primary} />
          </TouchableOpacity>
        </View>
    </View>
    )
  }
}