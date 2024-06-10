// Colors and gradients
export const COLORS = {
    gradient: ['#B8D8D8', '#EDBBB4', '#DBABBE', '#475B63', 'white'],
    flatListBackground: 'rgba(211, 211, 211, 0.5)',
    buttonBackground: '#007bff',
    buttonTextColor: '#fff',
    memberNicknameColorMaster: 'red',
    memberNicknameColorDefault: 'black',
  };
  
  // Gradients
  export const GRADIENTS = {
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  };
  
  // Styles
  export const STYLES = {
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
      justifyContent: 'center',
      padding: 8,
    },
    topButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
    },
    flatList: {
      backgroundColor: COLORS.flatListBackground,
      margin: 10,
      borderRadius: 16,
      padding: 10,
    },
    memberNickname: {
      fontSize: 32,
    },
    addButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10,
    },
    button: {
      padding: 10,
      backgroundColor: COLORS.buttonBackground,
      color: COLORS.buttonTextColor,
      borderRadius: 5,
      textAlign: 'center',
      marginTop: 10,
    },
  };
  