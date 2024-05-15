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
 * @param {int} sType - 0: equal or 1:custom values
 * 
 * @param {array} tAccount map of keys=billMembers IDs and values=null
 * note: when tSplitType is 1 (custom values), can have a number or null. Number - indicates specific debt, like 0 or 10 zł, whereas Null indicates that the user delegates calculations to us.
 *
 * @return {Promise<void>} groupId if successful
 */
export function Transactions1 (timestamp, groupId, whoPayed, billMembers, amount, currencyF, sType) {
    this.date = timestamp; // local timestamp
    this.groupId = groupId;
    this.tPayer = whoPayed;
    this.tAccount = new Map(); // map of userIds: null
    for (const key of billMembers){
      this.tAccount.set(key, null)
    }
    this.tPayment = [amount, currencyF]; // Name of the group
    this.tSplitType = sType; 
  }
  /**
   * @param {int} tempTrans - transactions instance. Note: assumed it was created by Transactions1;
   * 
   * @param {array} debtsForMem length MUST align to tAccount keys
   *
   * @return {Promise<void>} groupId if successful
   */
  export function updateTransaction2 (bill, debtsForMem) {
    if (bill.tSplitType === 0) { //equal
      const divider = bill.tAccount.size;
      const debt = bill.tPayment[0] / divider;
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
          bill.tAccount.set(key, debtsForMem[it]);
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
        for(let [key, value] of bill.tAccount){
          if(value===null){
            bill.tAccount.set(key, difference);
          }
        }
      }

    }
  }
