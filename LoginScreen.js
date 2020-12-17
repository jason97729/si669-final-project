import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TextInput, Text, View, 
  Image, TouchableOpacity, KeyboardAvoidingView, Alert} 
  from 'react-native';

import { loginStyles } from './Styles';
import { getDataModel } from './DataModel';

export class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.dataModel = getDataModel();

    this.state = {
      mode: 'login',
      emailInput: '',
      displayNameInput: '',
      passwordInput: '',
      passwordCheckInput: ''
    }
  }

  onCreateAccount = async () => {

    // check that this is a valid email (skipping this)
    // check password rules (skipping this)
    // check that passwords match (skipping this)
    // check that displayName isn't empty (skipping this)

    // check that user doesn't already exist
    let users = this.dataModel.getUsers();
    for (let user of users) {
      if (user.email === this.state.emailInput) {
        console.log("found matching user");
        Alert.alert(
          'Duplicate User',
          'User ' + this.state.emailInput + ' already exists.',
          [{ text: 'OK',style: 'OK'}]
        );
        return;
      } 
    } // made it through loop, no user exists!
    console.log("no matching user found, creating");
    let newUser = await this.dataModel.createUser(
      this.state.emailInput,
      this.state.passwordInput,
      this.state.displayNameInput
    );
    this.props.navigation.navigate("Recipes", {
      currentUser: newUser
    });
  }

  onLogin = () => {
    let users = this.dataModel.getUsers();
    let email = this.state.emailInput;
    let pass = this.state.passwordInput;
    for (let user of users) {
      if (user.email === email) {
        if (user.password === pass) {
          // success!
          this.props.navigation.navigate("Recipes", {
            currentUser: user
          });
          return;
        }
      }
    }
    // we got through all the users with no match, so failure
    Alert.alert(
      'Login Failed',
      'No match found for this email and password.',
      [{ text: 'OK',style: 'OK'}]
    );
  }

  render() {
    return (
      <KeyboardAvoidingView 
        style={loginStyles.container}
        behavior={"padding"}
        keyboardVerticalOffset={25}
        >
        <View style={loginStyles.topView}>
          <Image 
            source={require('./assets/logo.png')}
            style={loginStyles.logoImage}
          />
        </View>
        <View style={loginStyles.middleView}>
          {/* <StatusBar style="auto" /> */}
          <View style={loginStyles.inputRow}>
            {/* <Text 
              style={loginStyles.inputLabel}
            >Email:</Text> */}
            <TextInput
              style={loginStyles.inputText}
              keyboardType='email-address'
              placeholder='Enter email'
              autoCapitalize='none'
              autoCorrect={false}
              autoCompleteType='email'
              textContentType='emailAddress'
              value={this.state.emailInput}
              onChangeText={(text)=>{this.setState({emailInput: text})}}
            />
          </View>
          {this.state.mode === 'create' ? (
            <View style={loginStyles.inputRow}>
              {/* <Text style={loginStyles.inputLabel}>Display Name:</Text> */}
              <TextInput
                style={loginStyles.inputText}
                placeholder='Display name'
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.displayNameInput}
                onChangeText={(text)=>{this.setState({displayNameInput: text})}}
              />
            </View>
          ):(
            <View/>
          )}
          <View style={loginStyles.inputRow}>
            {/* <Text style={loginStyles.inputLabel}>Password:</Text> */}
            <TextInput
              secureTextEntry={true}
              style={loginStyles.inputText}
              placeholder='Enter password'
              autoCapitalize='none'
              autoCorrect={false}
              textContentType='password'
              value={this.state.passwordInput}
              onChangeText={(text)=>{this.setState({passwordInput: text})}}
          />
          </View>
          {this.state.mode === 'create' ? (
            <View style={loginStyles.inputRow}>
              {/* <Text style={loginStyles.inputLabel}>Re-enter Password:</Text> */}
              <TextInput
                secureTextEntry={true}
                style={loginStyles.inputText}
                placeholder='Re-enter password'
                autoCapitalize='none'
                autoCorrect={false}
                textContentType='password'  
                value={this.state.passwordCheckInput}
                onChangeText={(text)=>{this.setState({passwordCheckInput: text})}}
              />
            </View>
          ):(
            <View/>
          )}
        </View>
        {this.state.mode === 'login' ? (

          <View style={loginStyles.bottomView}>
            <TouchableOpacity 
              style={loginStyles.buttonContainer}
              onPress={()=>{
                this.setState({mode: 'create'})
              }}
              >
              <Text style={loginStyles.buttonText}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={loginStyles.buttonContainer}
              onPress={this.onLogin}
            >
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

        ):(

          <View style={loginStyles.bottomView}>
            <TouchableOpacity 
              style={loginStyles.buttonContainer}
              onPress={()=>{
                this.setState({mode: 'login'})
              }}
              >
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={loginStyles.buttonContainer}
              onPress={this.onCreateAccount}
              >
              <Text style={loginStyles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    )
  }
}