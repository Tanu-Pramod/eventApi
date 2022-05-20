const eventModel = require("../models/eventModel");
const guestModel = require("../models/guestModel");

const dropdown = async (req, res) => {
  let payload = {};
  payload["events"] = await eventModel.find().then((data) => data);
  payload["guests"] = await guestModel.find().then((data) => data);
  payload = { ...req.body, ...payload };
  res.render("mailer", payload);
  
}


module.exports = {dropdown};