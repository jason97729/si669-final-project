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
    this.theImage = undefined;
    this.theCallback = undefined;
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

      let imageRef = qDocSnap.ref.collection('images').doc('currentImage');
      let imageDocSnap = await imageRef.get();
      let imageData = imageDocSnap.data();
      // console.log("got image info", this.theImage);

      let thisRecipe  = {
        key: qDocSnap.id,
        name: data['name'],
        description: data['description'],
        ingredients: data['ingredients'],
        // process: data['process'],
        author: data['author'],
        imageURL: imageData['uri']
      }
      // data.key = qDocSnap.id;;
      // console.log(qDocSnap.data());

      // let imagesRef = qDocSnap.ref.collection("images");
      // let imagesQSnap = await imagesRef.get();
      // imagesQSnap.forEach(qDocSnap => {
      //   let imageData = qDocSnap.data();
      //   imageData.key = qDocSnap.id;
      //   thisRecipe.images.push(imageData);
      // });

      this.recipes.push(thisRecipe);

    });
    // let imageDocSnap = await this.currentImageRef.get();
    // this.theImage = imageDocSnap.data();
    // console.log("got image info", this.theImage);

    // since MainScreen.constructor() will run before DataModel.constructor()
    // we expect theCallback to have been set by now
    if (this.theCallback) {
        this.theCallback(this.theImage);
    }
  }

  getRecipes = () => {
    return this.recipes;
  }

  getRecipe = async (recipe) => {
    let thisRecipeDocRef = this.recipesRef.doc(recipe.key);

    let recipeDocSnap = await thisRecipeDocRef.get();
    let recipeData = recipeDocSnap.data();

    return recipeData
  }

  createRecipe = async (recipe) => {
    // assemble the data structure
    let newRecipe = {
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      // process: recipe.process,
      imageURL: recipe.imageURL,
      author: recipe.author
    }
    
    // this.recipesRef.add(newRecipe);

    // add the data to Firebase (user collection)
    let newRecipeDocRef = await this.recipesRef.add(newRecipe);

    // get the new Firebase ID and save it as the local "key"
    let key = newRecipeDocRef.id;
    newRecipe.key = key;
    this.recipes.push(newRecipe);
    return this.recipes;
  }

  updateRecipe = async (key, recipe) => {
    let thisRecipeDocRef = this.recipesRef.doc(key);
    // assemble the data structure
    let updateRecipe = {
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      // process: recipe.process,
      imageURL: recipe.imageURL,
      author: recipe.author
    }
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
    // let {recipes} = this.recipes;
    // let foundIndex = -1;
    // for (let idx in recipes) {
    //   if (recipes[idx].key === key) {
    //     foundIndex = idx;
    //     break;
    //   }
    // }
    // if (foundIndex !== -1) { // silently fail if item not found
    //   recipes.splice(foundIndex, 1); // remove one element 
    // }
    // return recipes;
  }


  // clients will call this method and provide the recipe object for
  // the recipe they want to subscribe to
  subscribeToRecipes = (recipes, notifyOnUpdate) => {

    // note that this next staatement takes up several lines
    // The first line give us a CollectionReference to the recipes 
    // The second calls 'onSnapshot()' on the CollectionRef and provides a function

    this.recipesRef.onSnapshot((querySnap) => {
  
        // we zero out whatever recipes were there previously and start over
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
      // console.log('SubscribeToRecipes Updated recipes:', recipes);   


      // call the callback function. Because the caller has a reference to 'chat'
      // we don't need to pass any arguments.
      notifyOnUpdate();

  }

  // clients will call this method and provide the recipe object for
  // the recipe they want to subscribe to
  subscribeToRecipe = (recipe, notifyOnUpdate) => {

    // note that this next statement takes up several lines
    // The first two give us a CollectionReference to this recipe's 'images' 
    // The third calls 'onSnapshot()' on the CollRef and provides a function
    this.recipesRef.doc(recipe.key)
      .collection('images')
      .onSnapshot((querySnap) => {

        // we zero out whatever images were there previously and start over
        recipe.images = [];

        // we go through each message Document Snapshot
        querySnap.forEach((qDocSnap) => {

          // build the image JavaScript object from the Firebase data
          let imageObj = qDocSnap.data();
          imageObj.key = qDocSnap.id;

          // and add the object to this recipe's images list
          recipe.images.push(imageObj);

        });
      });
    // // at the end of this, the recipe's images list matches what's in Firebase
    // console.log('Updated recipe images:', recipe.images);

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

  addRecipeImage = async (imageObj) => {
    // console.log('... and here we would add the image ...');
    // let recipeDocRef = this.recipesRef.doc(recipe.key).collection('process');
    // console.log('recipeKey', recipe.key)
    // if (typeof recipe.key !== "string") {
    //   recipe.key = recipe.key.toString()
    // }
    
    // let imagesRef = this.recipesRef.doc(recipe.key)

    

    if (this.theCallback) {
      this.theCallback(imageObj);
    }

    // this.theImage = imageObj;

    // if (this.theCallback) {
    //   this.theCallback(imageObj);
    // }

    let fileName = '' + Date.now();
    let imageRef = this.storageRef.child(fileName);

    let response = await fetch(imageObj.uri);
    let imageBlob = await response.blob();

    await imageRef.put(imageBlob);

    let downloadURL = await imageRef.getDownloadURL();

    let fbImageObject = {
      imageURL: downloadURL,
      timestamp: fileName,
    }

    // console.log(fbImageObject);

    return fbImageObject

    // imagesRef.add(fbImageObject)
    // this.recipesRef.doc(recipe.key).update(fbImageObject)
  }

  // this will allow the MainScreen to be notified when a new image is ready
  subscribeToImageUpdate = (callback) => {
    this.theCallback = callback;
  }

  subscribeToImage = async (recipe, notifyOnUpdate) => {
    this.recipesRef.doc(recipe.key).collection('images').onSnapshot((querySnap) => {

      // we zero out whatever image was there previously and start over
      recipe.imageURL = '';
      

      querySnap.forEach((qDocSnap) => {

        // let imageDocSnap = await imageRef.get();
        // let imageData = imageDocSnap.data();

        let imageData = qDocSnap.data();

        recipe.imageURL = imageData.uri;

      });

    });
    
    // .doc('currentImage');
    console.log('Updated recipe image URL:', recipe.imageURL);


    // call the callback function. Because the caller has a reference to 'chat'
    // we don't need to pass any arguments.
    notifyOnUpdate();

  }

  // this will allow the CameraScreen to update the image
  updateImage = async (recipe, imageObject) => {

    if (typeof recipe.key !== "string") {
        recipe.key = recipe.key.toString()
    }

    let currentImageRef = this.recipesRef.doc(recipe.key + '/images/currentImage');
        
    // let imagesRef = this.recipesRef.doc(recipe.key).collection('images');

    //imageObject format: {uri: xxx, width: yyy, height: zzz}
    this.theImage = imageObject;

    // invoke the callback right away, OK if the storage takes a bit longer
    if (this.theCallback) {
      this.theCallback(imageObject);
    }

    // Set up storage refs and download URL
    let fileName = '' + Date.now();
    let imageRef = this.storageRef.child(fileName);
    
    // fetch the image object from the local filesystem
    let response = await fetch(imageObject.uri);
    let imageBlob = await response.blob();

    // then upload it to Firebase Storage
    await imageRef.put(imageBlob);

    // ... and update the current image Document in Firestore
    let downloadURL = await imageRef.getDownloadURL();

    // create a DIFFERENT object to shove into Firebase
    let fbImageObject = {
      height: imageObject.height,
      width: imageObject.width,
      uri: downloadURL
    }
  //    imageObject.uri = downloadURL; // replace local URI with permanent one
    await currentImageRef.set(fbImageObject);
    // if (this.theCallback) {
    //   this.theCallback(imageObject);
    // }
  }
  
}


let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}