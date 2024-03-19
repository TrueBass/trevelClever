const schema = {
    users: {
      $userId: String, 
      email: String,
      nickname: String,
      password: String,
      profilePhotoUrl: String,
      uCurrency: String,
      groups: {
        $groupId: String, 
      },
      transactions: {
        $transactionId: String, 
      },
    },
    Group: {
      $groupId: String, 
      active: Boolean,
      members: {
        $userId: String, 
      },
      name: String,
      totalSpent: Number,
      transactions: {
        $transactionId: String, 
      },
      gDebts: {
        $gDebtId: String, 
        gCurrencyTo: String,
        gDebt: Number,
        gDebtor: {
          $userId: String, 
        },
        gReceiver: {
          $userId: String, 
        },
        settledD: Boolean,
      },
    },
    transactions: {
      $transactionId: String, 
      date: {
        timestamp: Number,
      },
      tPayer: String, 
      tPayees: {
        $userId: Boolean,
      },
      tPayment: {
        amount: Number,
        currencyF: String,
      },
      split: {
        sType: Number, 
        ratio: [Number], // Array of ratios for percentage split
      },
      tDebtors: {
        $debtorId: String, 
        howMuch: Number,
      },
    },
  };
  export default {users, grops, tranactions};