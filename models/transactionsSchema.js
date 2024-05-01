/*const Transactions = {
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
      debtorId: Boolean, 
      howMuch: Number,
    },
  }*/

  function Transactions (date, whoPayed, billMembers, amount, currencyF, sType, ratio, debtorIds) {
    this.date = date; // Boolean indicating whether the group is active
    this.tPayer = whoPayed;
    this.tPayees = billMembers; // Object with userIds as keys and boolean values indicating membership
    this.tPayment = [amount, currencyF]; // Name of the group
    this.split = [sType, ratio]; // Total amount spent by the group
    this.tDebtors = debtorIds; // Object containing all debtor ids
  }
export default Transactions;