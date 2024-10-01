const User = require("../models/User.model");

exports.featchUser = async (req, res) => {
  try {
    const user = await User.find({ _id: req.user }).exec();

    const { email, name, github, image ,_id} = user[0];

    res.status(200).json({ email, name, image, github,_id });
  } catch (error) {
    res.status(400).json(error);
  }
};
