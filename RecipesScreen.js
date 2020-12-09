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
                <TouchableOpacity 
                  // style={styles.footerButton}
                  onPress={()=>{this.props.navigation.navigate("Details")}}>
                  <Text style={peopleStyles.personText}>{item.name} </Text>
                </TouchableOpacity>
                // <Text style={peopleStyles.personText}>{item.name} </Text>
              );
            }}
          />
        </View>
      </View>
    )
  }
}