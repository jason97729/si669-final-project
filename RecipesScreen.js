import React from 'react';
import { Text, View, 
  FlatList, TouchableOpacity } 
  from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { recipeStyles, colors } from './Styles';
import { getDataModel } from './DataModel';

let recipes = [];

export class RecipesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();
    this.currentUser = this.props.route.params.currentUser
    console.log('testing user on RecipeScreen', this.currentUser.displayName);

    // call getRecipes and capture the result in this.recipes

    this.nextKey = 0;

    this.state = {
      recipes: recipes,
      // nameInput: '',
      // descriptionInput:'',
      // ingredientsInput: '',
      // processInput: ''
      //displayNameInput: '',
      //passwordInput: '',
    }
  }

  componentDidMount = () => {
    this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
    this.subscribeToRecipes();
  }


  subscribeToRecipes = async() => {


    this.recipes = this.dataModel.getRecipes();

    // when we subscribe, we will receive an update right away
    // and anytime there's a change thereafter. So we don't want to setState()
    // here but when we get the updates
    this.dataModel.subscribeToRecipes(this.recipes, this.onRecipesUpdate);
  }


  onRecipesUpdate = () => {
    // console.log('got recipes update', this.recipes);
    this.setState({recipes: this.recipes});
  }

  onFocus = () => {
    if (this.props.route.params) {
      const {operation, recipe} = this.props.route.params;
      if (operation === 'add') {
        this.createRecipe(recipe);
      } else if (operation === 'edit') {
        this.updateRecipe(recipe, recipe.key);
      } 
    }
    this.props.navigation.setParams({operation: 'none'});
  }

  createRecipe = async (recipe) => {
    
    let newRecipe = {
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      process: recipe.process,
      author: this.currentUser.displayName,
    }
    recipes = await this.dataModel.createRecipe(newRecipe)

    this.setState({recipes: recipes});
    
    // let newRecipe = await this.dataModel.createRecipe(
    //   this.state.nameInput,
    //   this.state.descriptionInput,
    //   this.state.ingredientsInput,
    //   this.state.processInput
    //   //this.state.passwordInput,
    //   //this.state.displayNameInput
    // );
  }

  updateRecipe = async (recipe, key) => {

    await this.dataModel.updateRecipe(key, recipe)

    let recipes = this.recipes;
    let foundIndex = -1;
    for (let idx in recipes) {
      if (recipes[idx].key === key) {
        foundIndex = idx;
        break;
      }
    }
    if (foundIndex !== -1) { // silently fail if item not found
      recipes[foundIndex].name = recipe.name;
      recipes[foundIndex].description = recipe.description;
      recipes[foundIndex].ingredients = recipe.ingredients; 
      recipes[foundIndex].process = recipe.process; 
      recipes[foundIndex].author = recipe.author;
    }
   
    this.setState({recipes: recipes});

    // this.props.navigation.navigate("Details", {
    //   recipes: this.recipes,
    //   currentRecipe: recipe
    // });
  }

  onDeleteRecipe = async(key) => {
    await this.dataModel.deleteRecipe(key);
    // let recipes = this.dataModel.deleteRecipe(key);
    // this.setState({recipes: recipes})
    let recipes = this.recipes;
    // console.log(recipes);
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
    // console.log(recipes);
    this.setState({recipes: recipes});
  }

  // onEdit = (recipe) => {
  //   console.log(recipe)
  //   this.props.navigation.navigate("Details", {
  //     operation: 'edit',
  //     CurrentRecipe: recipe
  //   });
  // }


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
                    onPress={()=>
                      this.props.navigation.navigate('Details', 
                      {operation: "edit",
                       currentRecipe: item,
                       currentUser: this.currentUser})}>
                    <Text style={recipeStyles.listItemText}>{item.name}</Text>
                      {item.author === this.currentUser.displayName ?
                          <Text style={recipeStyles.listAuthorText}>created by me</Text> : 
                          <Text style={recipeStyles.listAuthorText}>created by {item.author}</Text>}
                    {/* <Text style={recipeStyles.listItemText}>{item.name}</Text>
                    <Text style={recipeStyles.listAuthorText}>created by {item.author}</Text> */}
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
          <TouchableOpacity onPress={()=>
              this.props.navigation.navigate('Details', 
                {operation: "add",
                currentUser: this.currentUser})}>
            <Ionicons name="md-add-circle" 
            size={60} 
            color={colors.primary} />
          </TouchableOpacity>
        </View>
    </View>
    )
  }
}