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
    // console.log(this.props.route.params.recipe);

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
    console.log('got recipes update', this.recipes);
    this.setState({recipes: this.recipes});
  }

  onCreateRecipe = async () => {
    let newRecipe = {
      name: this.state.nameInput,
      description: this.state.descriptionInput,
      ingredients: this.state.ingredientsInput,
      process: this.state.processInput
    }
   
    await this.dataModel.createRecipe(newRecipe)
    
    // let newRecipe = await this.dataModel.createRecipe(
    //   this.state.nameInput,
    //   this.state.descriptionInput,
    //   this.state.ingredientsInput,
    //   this.state.processInput
    //   //this.state.passwordInput,
    //   //this.state.displayNameInput
    // );
    this.props.navigation.navigate("Details", {
      recipes: this.state.recipes,
      currentRecipe: newRecipe
    });
  }

  onDeleteRecipe = async(key) => {
    await this.dataModel.deleteRecipe(key);
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
                    <Text style={recipeStyles.listItemText}>{item.name}</Text>
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