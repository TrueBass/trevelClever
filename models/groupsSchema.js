//  const Groups = {
//     active: Boolean,
//     members: {
//       $userId: Boolean, 
//     },
//     name: String,
//     totalSpent: Number,
//     transactions: {
//       $transactionId: String, // how to implement 1-to-♾️
//     },
//     gDebts: {
//       $gDebtId: String, 
//       gCurrencyTo: String,
//       gDebt: Number,
//       gDebtor: {
//         $userId: Boolean, 
//       },
//       gReceiver: {
//         $userId: Boolean, 
//       },
//       settledD: Boolean,
//     },
//   }
  function Groups (active, master, members, name, totalSpent, transactions, groupDebts) {
      this.active = active; // Boolean indicating whether the group is active
      this.master = master;
      this.members = members; // Object with userIds as keys and boolean values indicating membership
      this.name = name; // Name of the group
      this.totalSpent = totalSpent; // Total amount spent by the group
      this.transactions = transactions; // Object containing transaction details with transactionIds as keys
      this.groupDebts = groupDebts; //????  Object containing group debts with gDebtIds as keys
    }
export default Groups;