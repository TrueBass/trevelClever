const Users = {
  email: String,
  nickname: String,
  password: String,
  profilePhotoUrl: '',
  uCurrency: '',
  groups: {
    groupId: false,
  },
  transactions: {
    transactionId: false,
  },
  friends: {
    friendID: false,
  },
  numFriends: Number, //how many friends user has
};
export default Users;