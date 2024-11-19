
// const express = require('express');
// const { getAllBills, createBills, deleteBills } = require('../controllers/bills.controllers');
// const router = express.Router();

// router.get('/getAll',getAllBills);
// router.post('/create',createBills);
// router.delete('/delete/:id',deleteBills);

// module.exports = router;



const express = require('express');
const { getAllBills, createBills, deleteBills, modifyBillHold } = require('../controllers/bills.controllers');
const router = express.Router();

router.get('/getAll',getAllBills);
router.post('/create',createBills);
router.delete('/delete/:id',deleteBills); 

// modify the bill items form hold to sold
// Route : url/bills/modify_bill
// body :{
//     bill_number:22
// }


router.post("/modify_bill",modifyBillHold)


module.exports = router;
