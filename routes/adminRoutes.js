const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const {
  addProduct,
  getProducts,
  updatePrice,
  updateSettings,
  getSettings,
  getUsers,
  updateUserRedirect  ,
  getAdditionPrices,
  updateAdditionPrices,
  updateAdmin
} = require("../controllers/adminController");




router.put("/update-admin", verifyToken, isAdmin, updateAdmin);
router.post("/product", verifyToken, isAdmin, addProduct);
router.get("/products", verifyToken, isAdmin, getProducts);
router.put("/product/:id", verifyToken, isAdmin, updatePrice);

router.get("/addition-prices", verifyToken, isAdmin, getAdditionPrices);
router.put("/addition-prices", verifyToken, isAdmin, updateAdditionPrices);

router.post("/settings", verifyToken, isAdmin, updateSettings);
router.get("/settings", verifyToken, isAdmin, getSettings);

router.get("/users", verifyToken, isAdmin, getUsers);
router.put("/user/:id/redirect", verifyToken, isAdmin, updateUserRedirect);

module.exports = router;




