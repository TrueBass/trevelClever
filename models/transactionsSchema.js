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


/**
 * Creates a new instance representing a group transaction.
 * 
 * NOTE: it includes a Map to keep track of each member's share of the payment (initially set to null).
 *        👩🏻‍✈️ guys, when you retrieve it from the firestore, you get a javascript object. 
 *  👩🏻‍✈️ also I convert a map to a simple javasctipt object before updating the collection
 * @param {number} timestamp - use function getLocalTime() from ./models/transactionTest/
 * @param {string} groupId - The ID of the group associated with the transaction.
 * @param {string} whoPayed - The ID of the member who paid.
 * @param {Array<string>} billMembers - Array of member IDs involved in the transaction.
 * @param {number} amount - The total amount paid.
 * @param {string} currencyF - The currency of the amount.
 * @param {number} sType - The split type (0 for equal, 1 for custom).
 * @param {string} title 
 */
export function Transactions1 (timestamp, groupId, whoPayed, billMembers, amount, currencyF, sType, title) {
    this.date = timestamp; // local timestamp
    this.groupId = groupId;
    this.tPayer = whoPayed;
    this.tAccount = new Map(); // map of userIds: null
    for (const key of billMembers){
      this.tAccount.set(key, null)
    }
    this.tPayment = [amount, currencyF]; // Name of the group
    this.tSplitType = sType; 
    this.title = title;
  }
/**
 * Updates the transaction splitting logic based on split type.
 * 
 * ⛵️ For split type 0 (equal splitting), it divides the total payment
 * equally among all members and updates their respective debt in the tAccount Map.
 * 🚤 For split type 1 (custom split), it assigns custom debt values to each member
 * and distributes any remainder equally among members who didn't have a pre-set debt.
 * 
 * @param {Object} bill - The bill object containing transaction details.
 * @param {Array<number|null>} debtsForMem - Array of debt amounts for each member, or null if no pre-set debt.
 */
export function updateTransaction2 (bill, debtsForMem) {
  if (bill.tSplitType === 0) { //equal
    const divider = bill.tAccount.size;
    let debt = bill.tPayment[0] / divider;
    debt = Number(debt.toFixed(2));
    for (let key of bill.tAccount.keys()) { // Corrected iteration over keys
      bill.tAccount.set(key, debt);
    }
  }
  else if (bill.tSplitType === 1){
    let it = 0;
    let sum = 0; // To keep track of the sum of numbers
    let nullCount = 0; // To count how many keys have null values
    for (let key of bill.tAccount.keys()){
      if(debtsForMem[it] !== null){
        bill.tAccount.set(key, -debtsForMem[it]);//set zero for defined values
        sum+=debtsForMem[it];
      }
      else{
        nullCount++;
      }
      it+=1;
    }
    if(sum !== bill.tPayment[0]){
      let difference = bill.tPayment[0] - sum;
      difference = difference/nullCount;
      difference = Number(difference.toFixed(2));
      for(let [key, value] of bill.tAccount){
        console.log(key);
        if(value===null){
          bill.tAccount.set(key, difference);
          
        }
      }
    }

  }
}

