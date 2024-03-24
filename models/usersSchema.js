const Users = {
    email: String,
    nickname: String,
    profilePhotoUrl: String,
    uCurrency: String,
    groups: {
      $groupId: Boolean,
    },
    transactions: {
      $transactionId: Boolean,
    },
    friends: {
      $friendID: Boolean,
    },
    numFriends:Number, //how many friends user has
  };
export default Users;