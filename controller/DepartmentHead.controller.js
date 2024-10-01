const DepartmentHead = require('../models/DepartmentHead'); // Mongoose model

 exports.getDeparmentHeadInfor =async (req, res) => {
    try {
        const head = await DepartmentHead.findOne();
        res.json(head);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching department head details' });
    }
}

exports.updateDeparmentHeadInfor =async (req, res) => {
    const { name, designation, email, photo } = req.body;
  
    try {
      let head = await DepartmentHead.findOne();
      if (head) {
        // Update existing head
        head.name = name;
        head.designation = designation;
        head.email = email;
        head.photo = photo;
      } else {
        // Create new head
        head = new DepartmentHead({ name, designation, email, photo });
      }
  
      await head.save();
      res.json({ message: "Department head saved successfully", head });
    } catch (error) {
      res.status(500).json({ message: "Error saving department head" });
    }
  }