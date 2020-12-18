import React from 'react';
import { TextInput, Text, View, 
  FlatList, Image, TouchableOpacity, Alert, KeyboardAvoidingView } 
  from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './Styles';
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
    this.dataModel = getDataModel();
    this.currentUser = this.props.route.params.currentUser;
    this.dataModel = getDataModel();
    // this.dataModel.subscribeToImageUpdate(this.onImageUpdate);
    console.log('testing currentUser once more again', this.currentUser.displayName)

    let nameInit = '';
    let descriptionInit = '';
    let ingredientsInit = '';
    let processInit = '';
    let imageURLInit = '';
    let authorInit = '';
    if (this.operation === 'edit') {
      nameInit = this.currentRecipe.name.toString();
      descriptionInit = this.props.route.params.currentRecipe.description.toString();
      ingredientsInit = this.props.route.params.currentRecipe.ingredients.toString();
      // processInit = this.props.route.params.currentRecipe.process.toString();
      imageURLInit = this.props.route.params.currentRecipe.imageURL.toString();
      authorInit = this.props.route.params.currentRecipe.author.toString();
      // authorInit = this.props.route.params.currentUser.displayName.toString();
    }

    this.state = {
      theImage: require('./assets/logo.png'), // placeholder
      nameInput: nameInit,
      descriptionInput: descriptionInit,
      ingredientsInput: ingredientsInit,
      // processInput: processInit,
      authorInit: authorInit,
    }
    console.log('testing author once more', authorInit)
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

  render() {
    return (
      <KeyboardAvoidingView 
            style={{ flex: 1, flexDirection: 'column', justifyContent: 'center',}} 
            behavior="padding" enabled   
            keyboardVerticalOffset={100}
            >
              <ScrollView>
              <View style={detailStyles.topView}>   
                <View style={detailStyles.inputRow}>   
                <Text 
                    style={detailStyles.inputLabel}
                    >Recipe Name</Text>
                {this.state.authorInit === this.currentUser.displayName ?
                    <TextInput
                    style={detailStyles.inputText}
                    keyboardType='default'
                    autoCapitalize='sentences'
                    placeholder='Enter recipe name'
                    autoCorrect={true}
                    autoCompleteType='name'
                    textContentType='name'
                    value={this.state.nameInput}
                    onChangeText={(text)=>{this.setState({nameInput: text})}}/>
                    : 
                 <Text style={detailStyles.inputText}> {this.state.nameInput}</Text>
                }
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
                    {this.state.authorInit === this.currentUser.displayName ? 
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
                            // process: this.state.processInput,
                            author: this.currentUser,
                            imageURL: this.state.theImage.uri,
                            key: -1 // placeholder for "no ID"
                          }
                        } else { // operation === 'edit'
                          theRecipe = this.props.route.params.currentRecipe;
                          theRecipe.name = this.state.nameInput;
                          theRecipe.description = this.state.descriptionInput;
                          theRecipe.ingredients = this.state.ingredientsInput;
                          // theRecipe.process = this.state.processInput;
                          theRecipe.author = this.currentUser;
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
                        : null
                      }
                    <Text 
                    style={detailStyles.inputLabel}
                    >Ingredients</Text>
                    {this.state.authorInit === this.currentUser.displayName ?
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
                      :
                      <Text style={detailStyles.inputText} >{this.state.ingredientsInput}</Text>
                    }
  
                    <Text 
                    style={detailStyles.inputLabel}
                    >Descriptions</Text>
                    {this.state.authorInit === this.currentUser.displayName ?
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
                      :
                      <Text style={detailStyles.inputText}>{this.state.descriptionInput}</Text>}
                  </View>
              </View>
              {this.state.authorInit === this.currentUser.displayName ?
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
                                  // process: this.state.processInput,
                                  imageURL: this.state.theImage.uri,
                                  author: this.currentUser,
                                  key: -1 // placeholder for "no ID"
                                }
                              } else { // operation === 'edit'
                                theRecipe = this.props.route.params.currentRecipe;
                                theRecipe.name = this.state.nameInput;
                                theRecipe.description = this.state.descriptionInput;
                                theRecipe.ingredients = this.state.ingredientsInput;
                                // theRecipe.process = this.state.processInput;
                                theRecipe.image = this.state.theImage.uri;
                                theRecipe.author= this.currentUser;
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
                  :
                  <View style={detailStyles.bottomView}>
                  <TouchableOpacity 
                    style={loginStyles.buttonContainer}
                    onPress={()=>{
                      this.props.navigation.goBack();
                    }}>
                    <Text style={detailStyles.buttonText}>Back</Text>
                  </TouchableOpacity>       
              </View>
                  }
              </ScrollView>
            
            </KeyboardAvoidingView>
    )
  }
}
