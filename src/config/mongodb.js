const prod = true;
if (prod) {
  exports.MONGO_URI = process.env.MONGODB_SRV || "";
} else {
  exports.MONGO_URI = "";
}
