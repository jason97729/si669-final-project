import React from 'react';
import { TextInput, Text, View, 
  FlatList, Image, TouchableOpacity, Alert } 
  from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { peopleStyles, recipeStyles, colors } from './Styles';
import { getDataModel } from './DataModel';

export class DetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();
    // this.currentUser = this.props.route.params.currentUser;

    let allRecipes = this.dataModel.getRecipes();
    this.imageWidth = 225,
    this.imageHeight = 300;

    this.state = {
      recipes: allRecipes
    }
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
                        <Text style={recipeStyles.sectionText}>Process</Text>
                        {/* <Image
                                style={{width: this.imageWidth, height: this.imageHeight}}
                                source={{uri: item.process}}
                            /> */}
                      </View>
                      <View>
                        <Text style={recipeStyles.sectionText}>Ingredients</Text>
                        <Text style={peopleStyles.personText}>{item.ingredients} </Text>
                      </View>
                      <View>
                        <Text style={recipeStyles.sectionText}>Description</Text>
                        <Text style={peopleStyles.personText}>{item.description} </Text>
                      </View>
                      <View>
                        <Text style={recipeStyles.sectionText}>Chats</Text>
                      </View>
                  </View>
              );
            }}
          />
        </View>
      </View>
    )
  }
}