const Groups = {
    $groupId: String, 
    active: Boolean,
    members: {
      $userId: Boolean, 
    },
    name: String,
    totalSpent: Number,
    transactions: {
      $transactionId: String, // how to implement 1-to-♾️
    },
    gDebts: {
      $gDebtId: String, 
      gCurrencyTo: String,
      gDebt: Number,
      gDebtor: {
        $userId: Boolean, 
      },
      gReceiver: {
        $userId: Boolean, 
      },
      settledD: Boolean,
    },
  }
  export default Groups;