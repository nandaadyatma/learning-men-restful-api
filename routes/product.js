const router = require("express").Router();
const product = require("../models/product");
const { verifyToken } = require("../validation");
// verifyTOken also can be implemented for all product routes at once, if we implemented in server.js (similar way to use it)

// CRUD Operation

// create product (/api/products/)
router.post("/", verifyToken, (req, res) => {

    const data = req.body

    product.insertMany(data)
        .then(data => {
            res.send(
                {
                    "error": false,
                    "message": "Successfully added product data",
                    "data": data
                }
            );
        })
        .catch(err => { res.status(500).send({ message: err.message }) })
});


// get all products
router.get("/", (req, res) => {

    product.find()
        .then(data => {
            res.send(
                {
                    "error": false,
                    "message": "Successfully get product data",
                    "data": data
                }
            );

        })
        .catch(error => {
            res.status(500).send(
                {
                    error: true,
                    message: error.message
                }

            )
        })

});


// get instock product
router.get("/instock", (req, res) => {
    product.find({ inStock: true })
        .then(data => {
            res.send(
                {
                    "error": false,
                    "message": "Successfully get product instock data",
                    "data": data
                }
            );

        })
        .catch(error => {
            res.status(500).send(
                {
                    error: true,
                    message: error.message
                }
            )
        }
        )
})

// get specific product
router.get("/:id", (req, res) => {
    product.findById(req.params.id)
        .then(data => {
            res.send(
                {
                    "error": false,
                    "message": "Successfully get product data",
                    "data": data
                }
            );
        })
        .catch(error => {
            res.status(500).send(
                {
                    error: true,
                    message: error.message
                }
            )
        }
        )
});

// update spesific product

router.put("/:id", (req, res) => {
    const id = req.params.id
    const data = req.body

    product.findByIdAndUpdate(id, data,
        {
            new: true,
            runValidators: true,
            // upsert: true //if you want to allow add new data if theres no data with current ID

        })
        .then(result => {

            if (!result) {
                res.status(500).send(
                    {
                        error: true,
                        message: "Cannot update product with id " + id + ". Maybe product doesn't exist"
                    }
                )
            }
            else {
                res.status(200).send(
                    {
                        "error": false,
                        "message": "Successfully update product data with id " + id,
                        "data": result
                    }
                )
            }

        }
        ).catch(error => {
            res.status(500).send(
                {
                    error: true,
                    message: error.message
                }
            )
        })

}
);


// delete spesific product
router.delete("/:id", (req, res) => {
    const id = req.params.id
    const data = req.body

    product.findByIdAndDelete(id)
        .then(result => {

            if (!result) {
                res.status(500).send(
                    {
                        error: true,
                        message: "Cannot delete product with id " + id + ". Maybe product doesn't exist"
                    }
                )
            }
            else {
                res.status(200).send(
                    {
                        "error": false,
                        "message": "Successfully delete product data with id " + id,
                        "data": result
                    }
                )
            }

        }
        ).catch(error => {
            res.status(500).send(
                {
                    error: true,
                    message: error.message
                }
            )
        })

}
);

module.exports = router;