const Transactions = {
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
      $debtorId: Boolean, 
      howMuch: Number,
    },
  }
  export default Transactions;