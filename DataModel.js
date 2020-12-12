import firebase from 'firebase';
import '@firebase/firestore';
import '@firebase/storage';
import { firebaseConfig } from './Secrets';

class DataModel {
  constructor() {
    if (firebase.apps.length === 0) { // aka !firebase.apps.length
      firebase.initializeApp(firebaseConfig);
    }
    this.recipesRef = firebase.firestore().collection('recipes');
    this.usersRef = firebase.firestore().collection('users');
    this.storageRef = firebase.storage().ref();
    this.recipes = [];
    this.users = [];
    this.chatListeners = [];
    this.asyncInit();
  }

  asyncInit = async () => {
    this.loadRecipes();
    this.loadUsers();
    //this.subscribeToChats();
  }

  loadRecipes = async () => {
    let querySnap = await this.recipesRef.get();
    querySnap.forEach(async qDocSnap => {
      let data = qDocSnap.data();
      let thisRecipe = {
        key: qDocSnap.id,
        name: [],
        description: [],
        ingredients: [],
        process: [],
      }
      thisRecipe.name.push(data.name);
      thisRecipe.description.push(data.description);
      thisRecipe.ingredients.push(data.ingredients);
      thisRecipe.process.push(data.process);
      this.recipes.push(thisRecipe);
    });
  }

  getRecipes = () => {
    return this.recipes;
  }

  createRecipe = async (recipe) => {
    // assemble the data structure
    let newRecipe = {
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      process: recipe.process

      //password: pass,
      //displayName: dispName
    }
    
    this.recipesRef.add(newRecipe);


    // // add the data to Firebase (user collection)
    // let newRecipeDocRef = await this.recipesRef.add(newRecipe);

    // // get the new Firebase ID and save it as the local "key"
    // let key = newRecipeDocRef.id;
    // newRecipe.key = key;
    // this.recipes.push(newRecipe);
    // return newRecipe;
  }

  updateRecipe = async (key, recipe) => {
    // assemble the data structure
    let updateRecipe = {
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      process: recipe.process
    }
    let thisRecipeDocRef = this.recipesRef.doc(key);
    thisRecipeDocRef.update(updateRecipe);
    // let {recipes} = this.recipes;
    // let foundIndex = -1;
    // for (let idx in recipes) {
    //   if (recipes[idx].key === key) {
    //     foundIndex = idx;
    //     break;
    //   }
    // }
    // if (foundIndex !== -1) { // silently fail if item not found
    //   recipes[foundIndex].name = name;
    //   recipes[foundIndex].description = description;
    //   recipes[foundIndex].ingredients = ingredients; 
    // }
    // return recipes;
  }

  deleteRecipe = async (key) => {
    let recipeDocRef = this.recipesRef.doc(key);
    await recipeDocRef.delete();
    let {recipes} = this.recipes;
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
    return recipes;
  }


  // clients will call this method and provide the recipe object for
  // the recipe they want to subscribe to
  subscribeToRecipes = (recipes, notifyOnUpdate) => {

    // note that this next statement takes up several lines
    // The first line give us a CollectionReference to the recipes 
    // The second calls 'onSnapshot()' on the CollectionRef and provides a function

    this.recipesRef.onSnapshot((querySnap) => {
  
        // we zero out whatever messages were there previously and start over
        recipes = [];


        // we go through each recipe Document Snapshot
        querySnap.forEach((qDocSnap) => {


          // build the message JavaScript object from the Firebase data
          let recipeObj = qDocSnap.data();
          recipeObj.key = qDocSnap.id;


          // and add the object to this chat's messages list
          recipes.push(recipeObj);

        });
      });
    
      // at the end of this, the recipes list matches what's in Firebase
      // console.log('Updated recipes:', recipes);   


      // call the callback function. Because the caller has a reference to 'chat'
      // we don't need to pass any arguments.
      notifyOnUpdate();

  }

  loadUsers = async () => {
    let querySnap = await this.usersRef.get();
    querySnap.forEach(qDocSnap => {
      let key = qDocSnap.id;
      let data = qDocSnap.data();
      data.key = key;
      this.users.push(data);
    });
  }

  getUsers = () => {
    return this.users;
  }

  createUser = async (email, pass, dispName) => {
    // assemble the data structure
    let newUser = {
      email: email,
      password: pass,
      displayName: dispName
    }

    // add the data to Firebase (user collection)
    let newUserDocRef = await this.usersRef.add(newUser);

    // get the new Firebase ID and save it as the local "key"
    let key = newUserDocRef.id;
    newUser.key = key;
    this.users.push(newUser);
    return newUser;
  }

  getUserForID = (id) => {
    for (let user of this.users) {
      if (user.key === id) {
        return user;
      }
    }
    // will return undefined. No haiku this time...
  }

  loadChats = async () => {
    let querySnap = await this.chatsRef.get();
    querySnap.forEach(async qDocSnap => {
      let data = qDocSnap.data();
      let thisChat = {
        key: qDocSnap.id,
        participants: [],
        messages: []
      }
      for (let userID of data.participants) {
        let user = this.getUserForID(userID);
        thisChat.participants.push(user);
      }

      let messageRef = qDocSnap.ref.collection("messages");
      let messagesQSnap = await messageRef.get();
      messagesQSnap.forEach(qDocSnap => {
        let messageData = qDocSnap.data();
        messageData.author = this.getUserForID(messageData.author);
        messageData.key = qDocSnap.id;
        thisChat.messages.push(messageData);
      });
      this.chats.push(thisChat);
    });
  }  

  subscribeToChat = (chat, notifyOnUpdate) => {
    this.chatSnapshotUnsub = this.chatsRef.doc(chat.key)
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot((querySnap) => {
        chat.messages = [];
        querySnap.forEach((qDocSnap) => {
          let messageObj = qDocSnap.data();
          messageObj.key = qDocSnap.id;
          messageObj.author = this.getUserForID(messageObj.author);
          chat.messages.push(messageObj);
        });
        notifyOnUpdate(); // call back to the subscriber
    });
  }

  unsubscribeFromChat = (chat) => {
    // don't really need 'chat' but could need it in the future
    if (this.chatSnapshotUnsub) {
      this.chatSnapshotUnsub();
    }
  }

  addChatListener = (listener, chatID) => {
    this.subscribeToChat(chatID);
    this.chatListeners.push({
      listener: listener,
      chatID: chatID
    });
  }

  notifyChatListeners = (_chatID) => {
    this.chatListeners.forEach(({listener, chatID}) => {
      if (chatID === _chatID) {
        listener.onChatUpdate();
      }
    });
  }

  getOrCreateChat = async (user1, user2) => {

    // look for this chat in the existing data model 'chats' array
    // if it's here, we know it's already in Firebase
    for (let chat of this.chats) {
      // we need to use user keys to look for a match
      // and we need to check for each user in each position
      if (( chat.participants[0].key === user1.key && 
            chat.participants[1].key === user2.key) ||
          ( chat.participants[0].key === user2.key &&
            chat.participants[1].key === user1.key)){
        return chat; // if found, return it and we're done
      }
    }

    // chat not found, gotta create it. Create an object for the FB doc
    let newChatDocData = { participants: [user1.key, user2.key] };
    // add it to firebase
    let newChatDocRef = await this.chatsRef.add(newChatDocData);
    // create a local chat object with full-fledged user objects (not just keys)
    let newChat = {
      participants: [user1, user2],
      key: newChatDocRef.id, // use the Firebase ID
      messages: []
    }
    // add it to the data model's chats, then return it
    this.chats.push(newChat);
    return newChat;
  }

  getChatForID = (id) => {
    for (let chat of this.chats) {
      if (chat.key === id) {
        return chat;
      }
    }
    // the chat was not found
    // should throw an error prob'ly
    // return undefined
    // [[almost accidental haiku]]
  }

  addChatMessage = async (chatID, message) => { // doesn't need to be async?

    let messagesRef = this.chatsRef.doc(chatID).collection('messages');

    let fbMessageObject = {
      type: 'text',
      text: message.text,
      timestamp: message.timestamp,
      author: message.author.key,
    }

    messagesRef.add(fbMessageObject); // onSnapshot will update local model
  }

  addChatImage = async (chat, author, imageObject) => {
    
    let messagesRef = this.chatsRef.doc(chat.key).collection('messages');

    if (this.theCallback) {
      this.theCallback(imageObject);
    }

    let fileName = '' + Date.now();
    let imageRef = this.storageRef.child(fileName);
    
    let response = await fetch(imageObject.uri);
    let imageBlob = await response.blob();

    await imageRef.put(imageBlob);

    let downloadURL = await imageRef.getDownloadURL();

    let fbImageObject = {
      imageURL: downloadURL,
      author: author.key,
      timestamp: fileName,
    }

    messagesRef.add(fbImageObject);
    console.log('... and here we would add the image ...');
  }

}


let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}