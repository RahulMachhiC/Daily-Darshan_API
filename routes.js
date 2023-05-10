const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const moment = require('moment');

const Temple = require('./models/temple');
const Contact = require('./models/contact');
const ManglaDarshan = require('./models/mangladarshan');
const { Op } = require('sequelize');

const SringarDarshan = require('./models/sringardarshan');






// Initialize Multer for handling file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('File must be an image'));
    }
    cb(null, true);
  }
});



router.get('/temples/:id/manglaDarshan', (req, res) => {
  const templeId = req.params.id;

  ManglaDarshan.findAll({
    where: {
      templeId: templeId,
    },
    order: [['created_At', 'DESC']],
  })
    .then((manglaDarshan) => {


      if (manglaDarshan.length > 0) {
        const manglaDarshans = manglaDarshan.map(md => {
          return {
            id: md.id,
            image: md.image,
            created_At: moment(md.created_At).format('DD-MM-YYYY'),
            updated_At: moment(md.updated_At).format('DD-MM-YYYY'),
          };
        });

        res.json({
          success: true,
          message: 'Mangla Darshan data found',
          data: manglaDarshans,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Mangla Darshan data not found',
        });
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Error retrieving Mangla Darshan data',
        error: error,
      });
    });
});


router.get('/temples', async (req, res) => {
  try {
    const temples = await Temple.findAll();

    if (temples.length === 0) {
      return res.status(404).json({
          success: false,
          message: 'No Temples Found',
        });
    }

    res.json({
      success: true,
      message: 'Temples retrieved successfully',
      data: temples,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: 'Failed to retrieve temples',
    });
  }
});
router.get('/temples/:id/srindarDarshan', (req, res) => {
  const templeId = req.params.id;

  SringarDarshan.findAll({
    where: {
      templeId: templeId,
    },
    order: [['created_At', 'DESC']],

  })
    .then((srindarDarshan) => {


      if (srindarDarshan.length > 0) {
        const srindarDarshans = srindarDarshan.map(md => {
          return {
            id: md.id,
            image: md.image,
            created_At: moment(md.created_At).format('DD-MM-YYYY'),
            updated_At: moment(md.updated_At).format('DD-MM-YYYY'),
          };
        });

        res.json({
          success: true,
          message: 'Sringar Darshan data found',
          data: srindarDarshans,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Sringar Darshan data not found',
        },);
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Error retrieving Sringar Darshan data',
        error: error,
      });
    });
});
// GET all contacts
router.get('/contact', (req, res) => {
  Contact.findAll()
    .then(contacts => {
      if (contacts.length === 0) {
        return res.status(404).json({ success: false, message: 'No contacts found.' });
      }
      res.status(200).json({ success: true, contacts });
    })
    .catch(err => res.status(500).json({ success: false, message: err.message }));
});


router.get('/manglasearch/:date/:id', (req, res) => {
  ManglaDarshan.findAll({
    where: {
      created_At: req.params.date,
      templeid : req.params.id
    },
    order: [['created_At', 'DESC']],

  }).then((results) => {

    if (results.length ==0) {
      res.status(404).json({
        success: false,
        message: 'Sringar Darshan data not found',
      },);
    } else {
      const srindarDarshans = results.map(md => {


        return {
          id: md.id,
          image: md.image,
          created_At: moment(md.created_At).format('DD-MM-YYYY'),
          updated_At: moment(md.updated_At).format('DD-MM-YYYY'),
        };
      });
      res.json({
        success: true,
        message: 'Mangla Darshan data found',
        data: srindarDarshans,
      });    }
  }).catch((error) => {
    res.status(500).json({
      error: 'Error searching images by created date'
    });
  });
});


router.get('/sringarsearch/:date/:id', (req, res) => {
  SringarDarshan.findAll({
    where: {
      created_At: req.params.date,
      templeid : req.params.id
    },
    order: [['created_At', 'DESC']],

  }).then((results) => {

    if (results.length ==0) {
      res.status(404).json({
        success: false,
        message: 'Sringar Darshan data not found',
      },);
    } else {
      const srindarDarshans = results.map(md => {
        return {
          id: md.id,
          image: md.image,
          created_At: moment(md.created_At).format('DD-MM-YYYY'),
          updated_At: moment(md.updated_At).format('DD-MM-YYYY'),
        };
      });
      res.json({
        success: true,
        message: 'Sringar Darshan data found',
        data: srindarDarshans,
      });    }
  }).catch((error) => {
    res.status(500).json({
      error: 'Error searching images by created date'
    });
  });
});




router.post('/mangla-darshan', upload.array('images'), async (req, res) => {
  try {
    const { templeid } = req.body;

    const temple = await Temple.findByPk(templeid);

    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found' });
    }

    const filenames = req.files.map((file) => file.filename);
    if (filenames.length == 0) {
      return res.send({
        success :false,
        message: "Please Add Images"
      })
    }
    const manglaDarshan = await ManglaDarshan.create({
      templeid,
      image: filenames,
    });


    return res.status(201).json({ success: true, message: 'Mangla Darshan created', data: manglaDarshan });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/sringar-darshan', upload.array('images'), async (req, res) => {
  try {
    const { templeid } = req.body;

    const temple = await Temple.findByPk(templeid);

    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found' });
    }

    const filenames = req.files.map((file) => file.filename);
    if (filenames.length == 0) {
      return res.send({
        success :false,
        message: "Please Add Images"
      })
    }

    const sringarDarshan = await SringarDarshan.create({
      templeid,
      image: filenames,
    });

    return res.status(201).json({ success: true, message: 'Sringar Darshan created', data: sringarDarshan });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Define the POST route to create a new temple
router.post('/temples', upload.single('image'), async (req, res) => {
    try {
      const { templeName } = req.body;
      const imagePath = req.file ? path.join('/', req.file.path) : null;
      const temple = await Temple.create({
        templeName,
        image: imagePath
      });
      return res.json({
        success: true,
        message: 'Temple created successfully',
        data: temple
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Error creating temple',
        error: err.message
      });
    }
  });
  //Access of Upload Directory
router.use('/uploads', express.static('uploads'));

// POST a new contact
router.post('/contact', upload.single('image'),async (req, res) => {
  const image = req.file ? req.file.filename : null;

  try {
    const { name, email, mobile, message } = req.body;
    const image = req.file ? path.join('/', req.file.path) : null;
    const temple = await Contact.create({
      name, email, mobile,message,
      image: image
    });
    return res.json({
      success: true,
      message: 'Contact successfully',
      data: temple
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Error creating Contact',
      error: err.message
    });
  }

});

module.exports = router;

  
