const express = require('express')
const router = express.Router()
const { getPlacementStudents, createPlacementStudent, updatePlacementStudent, deletePlacementStudent } = require('../controller/PlacementStudent.controller')
const { fileSizeError } = require('../middlewares/fileSizeError')
const {upload} = require('../middlewares/multer.middlewares')


router.get('/', getPlacementStudents)
router.post('/',upload.single("image"),fileSizeError ,createPlacementStudent)
router.put('/:id', updatePlacementStudent)
router.delete('/:id', deletePlacementStudent)

exports.router = router