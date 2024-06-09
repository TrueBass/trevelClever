
const userIds = ["kec78HNqQeNNjTKJzQcLvwdHvFk2", "bqaGaKAbumXDIVZyVayLJTbxPdY2", "-Nt_-3QMIQgtiOr-WFUl"]
const groupId = "Vkmi1FGzOSCpKBMB5969"
const billMem1 = [userIds[2], userIds[0], userIds[1]]
const billMem2 = [userIds[2], userIds[0], userIds[1]]

//Create bills
let bill1 = new Transactions1(getLocalTime(), groupId, userIds[2], billMem1, 100, "EUR", 0, "In the coffee shop");
bill1 = updateTransaction2(bill1, null);
let bill2 = new Transactions1(getLocalTime(), groupId, userIds[0], billMem1, 150, "EUR", 1, "Going to hell with Antchak");
bill2 = updateTransaction2(bill2, [45, null, null]);
let bill3 = new Transactions1(getLocalTime(), groupId, userIds[1], billMem1, 506, "EUR", 1, "Playing chess hard");
bill2 = updateTransaction2(bill2, [null, 125, null]);

//Add bills. Check if they where referenced in groupId.
addBill(bill1, groupId).then(billId => {
    console.log('New bill:', billId);
  });
addBill(bill2, groupId).then(billId => {
    console.log('New bill:', billId);
  });
addBill(bill3, groupId).then(billId => {
    console.log('New bill:', billId);
  });

// Usage
createNetAmountList(groupId).then(netAmounts => {
  console.log('Net Amounts:', netAmounts);
});

minimizeTransactions(groupId).then(transactions => {
    console.log('Minimized Transactions:', transactions);
  });