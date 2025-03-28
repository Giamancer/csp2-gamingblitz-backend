//[SECTION] Activity: Dependencies and Modules
const Product = require("../models/Product");
const { errorHandler } = require("../auth");

module.exports.createProduct = (req, res) => {
    const { name, description, price } = req.body;

    const newProduct = new Product({
        name,
        description,
        price
    });

    newProduct.save()
        .then((savedProduct) => {
            res.status(201).json({
                message: "Product created successfully",
                product: {
                    _id: savedProduct._id,
                    name: savedProduct.name,
                    description: savedProduct.description,
                    price: savedProduct.price,
                    isActive: savedProduct.isActive,
                    createdOn: savedProduct.createdOn
                }
            });
        })
        .catch((err) => {
            res.status(500).json({ error: errorHandler(err, req, res) });
        });
};

module.exports.getAllProducts = (req, res) => {
    Product.find({})
        .then((products) => {
            const formattedProducts = products.map(product => ({
                _id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                isActive: product.isActive,
                createdOn: product.createdOn
            }));

            res.status(200).json(formattedProducts); 
        })
        .catch((err) => {
            res.status(500).json({ error: "Failed to retrieve products" });
        });
};

// [SECTION] Active Product Info (All)
exports.getActiveProducts = async (req, res) => {
    try {
        const activeProducts = await Product.find({ isActive: true }); // Fetch active products
        res.status(200).json(activeProducts); // Send response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve Single Product
module.exports.getProduct = (req, res) => {
    const productId = req.params.productId;

    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json(product);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error retrieving product", error: error.message });
        });
};

// [SECTION] Update Product Info (Admin Only)
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

// [SECTION] Archive Product (Admin Only)
exports.archiveProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const archivedProduct = await Product.findByIdAndUpdate(productId, { isActive: false }, { new: true });

        if (!archivedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product archived successfully", archivedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error archiving product", error: error.message });
    }
};

// [SECTION] Activate Product (Admin Only)
exports.activateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const activateProduct = await Product.findByIdAndUpdate(productId, { isActive: true }, { new: true });

        if (!activateProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product activated successfully", activateProduct });
    } catch (error) {
        res.status(500).json({ message: "Error activating product", error: error.message });
    }
};

/*module.exports.addCourse = (req, res) => {

    let newCourse = new Course({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    Course.findOne({ name: req.body.name})
    .then(existingCourse => {
        if (existingCourse){
            return res.status(409).send({ message: 'Course already exists'});
        } else {
            return newCourse.save()
            .then(result => 
                res.status(201).send({
                    success: true,
                    message: 'Course added successfully',
                    result: result
                }))
            .catch(error => 
                errorHandler(error, req, res));
        }
    })
    .catch(error => errorHandler(error, req, res));  
}; 


module.exports.getAllCourses = (req, res) => {
    return Course.find({})
    .then(result => {
        // if the result is not null send status 30 and its result
        if(result.length > 0){
            return res.status(200).send(result);
        }
        else{
            // 404 for not found courses
            return res.status(404).send({ message: 'No courses found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getAllActive = (req, res) => {

    Course.find({ isActive : true }).then(result => {
        // if the result is not null
        if (result.length > 0){
            // send the result as a response
            return res.status(200).send(result);
        }
        // if there are no results found
        else {
            // send the message as the response
            return res.status(404).send({ message: 'No active courses found' })
        }
    }).catch(err => res.status(500).send(err));

};


module.exports.getCourse = (req, res) => {
    Course.findById(req.params.id)
    .then(course => {
        if(course) {
            return res.status(200).send(course);
        } else {
            return res.status(404).send({ message: 'Course not found' });
        }
    })
    .catch(error => errorHandler(error, req, res)); 
};


module.exports.updateCourse = (req, res)=>{

    let updatedCourse = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    return Course.findByIdAndUpdate(req.params.courseId, updatedCourse)
    .then(course => {
        if (course) {
            res.status(200).send({ success: true, 
                message: 'Course updated successfully' });
        } else {
            res.status(404).send({ message: 'Course not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.archiveCourse = (req, res) => {
  
    let updateActiveField = {
        isActive: false
    };

    Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
        .then(course => {
            // Check if a course was found
            if (course) {
                // If course found, check if it was already archived
                if (!course.isActive) {
                    // If course already archived, return a 200 status with a message indicating "Course already archived".
                    return res.status(200).send({ 
                        message: 'Course already archived',
                        course: course
                        });
                }
                // If course not archived, return a 200 status with a boolean true.
                return res.status(200).send({ 
                            success: true, 
                            message: 'Course archived successfully'
                        });
            } else {
                // If course not found, return a 404 status with a boolean false.
                return res.status(404).send({ message: 'Course not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};


module.exports.activateCourse = (req, res) => {
  
    let updateActiveField = {
        isActive: true
    }

    Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
        .then(course => {
            // Check if a course was found
            if (course) {
                // If course found, check if it was already activated
                if (course.isActive) {
                    // If course already activated, return a 200 status with a message indicating "Course already activated".
                    return res.status(200).send({ 
                        message: 'Course already activated', 
                        course: course
                    });
                }
                // If course not yet activated, return a 200 status with a boolean true.
                return res.status(200).send({
                    success: true,
                    message: 'Course activated successfully'
                });
            } else {
                // If course not found, return a 404 status with a boolean false.
                return res.status(404).send({ message: 'Course not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.searchCoursesByName = async (req, res) => {
    try {
        const { courseName } = req.body;
    
        // Use a regular expression to perform a case-insensitive search
        const courses = await Course.find({
        name: { $regex: courseName, $options: 'i' }
        });
    
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.searchCoursesByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body;

        // Ensure both minPrice and maxPrice are provided
        if (minPrice === undefined || maxPrice === undefined) {
            return res.status(400).json({ message: "Both minPrice and maxPrice are required." });
        }

        // Validate price range
        if (minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
            return res.status(400).json({ message: "Invalid price range." });
        }

        // Search for courses within the given price range
        const courses = await Course.find({
            price: { $gte: minPrice, $lte: maxPrice },
            isActive: true // Ensuring only active courses are returned
        });

        // If no courses found
        if (courses.length === 0) {
            return res.status(404).json({ message: "No courses found within this price range." });
        }

        res.status(200).json(courses);

    } catch (error) {
        res.status(500).json({ message: "An error occurred.", error: error.message });
    }
};*/