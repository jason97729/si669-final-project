import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#30475E', // Dark Blue
  primaryDark: '#222831', // Dark dark blue
  primaryLight: '#EFF8FF',
  primaryRed: '#F05454', // Red
  outline: '#E8E8E8' // MD Gray 400
}

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20
  },
    topView: {
      flex: 0.2,
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '100%',
    },
      logoImage: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
      },
    middleView: {
      flex: 0.6,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    inputRow:{
      width:"80%",
      backgroundColor:'#EFF8FF',
      borderRadius:25,
      height:30,
      marginBottom:20,
      justifyContent:"center",
      padding:20
    },
        inputText: {
          height:30,
          fontSize: 18,
          color:colors.primary
        },
      bottomView: {
        flex: 0.2,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start'
      },
        buttonContainer: {
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.primary,
          borderRadius: 10,
          backgroundColor: colors.primary,
          width: 100,
          height: 45,
          margin: 5
        },
          buttonText: {
            textAlign: 'center',
            color: 'white',
            fontSize: 16
          }
});

export const recipeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10
  },
    recipeListContainer: {
      flex: 0.8,
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      width: '100%',
    },  
      separator: {
        backgroundColor: colors.outline,
        height: 3,
        width: '80%',
        alignSelf: 'center'
      },
      listItemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
      },
      listItemTextContainer: {
        flex: 0.8,
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
        listItemText: {
          color: colors.primary,
          fontSize: 18,
        },
        listAuthorText: {
          fontSize: 15,
          paddingTop: 5,
          color: '#BBB'
        },
      footer: {
          flex: 0.2,
          justifyContent: 'center',
        },
});

export const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 400,
    height: 100,
    resizeMode: 'contain'
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 0.95,
  },
  cameraControls: {
    flex: 0.05, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: '5%',
    width: '100%',
    backgroundColor: colors.primary
  },
  cameraText: {
    fontSize: 25,
    color: 'white'
  },
    topView: {
      flex: 0.2,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: 'lightblue',
    },
    middleView: {
      flex: 0.6,
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      width: '100%',
    },
      inputRow: {
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20
      },
        inputLabel: {
          paddingTop:10,
          paddingBottom: 10,
          fontSize: 20,
          fontWeight: '500'
        },
        inputText: {
          borderColor: colors.outline,
          paddingBottom: 10,
          borderBottomWidth: 3,
          fontSize: 18,
        },
        inputTextOther: {
          paddingBottom: 10,
          fontSize: 18,
        },
        mainImage: {
          backgroundColor: colors.primary,
          width: 350,
          height: 250,
          borderRadius: 5,
          resizeMode: 'contain'
        },
      bottomView: {
        flex: 0.2,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
      },
        buttonContainer: {
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.outline,
          borderRadius: 10,
          backgroundColor: colors.primary,
          width: 100,
          height: 45,
          margin: 5
        },
          buttonText: {
            textAlign: 'center',
            color: 'white',
            fontSize: 16
          }
});