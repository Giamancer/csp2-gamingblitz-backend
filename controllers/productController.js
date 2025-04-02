//[SECTION] Activity: Dependencies and Modules
const Product = require("../models/Product");
const { errorHandler } = require("../auth");

// Create Product
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

// Retrieve All Products
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

// Retrieve All Active Products
exports.getActiveProducts = async (req, res) => {
    try {
        const activeProducts = await Product.find({ isActive: true }); // Fetch active products
        // If no active products, return an empty array
        res.status(200).json(activeProducts || []);
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

// Update Product Info
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
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

// Archive Product
exports.archiveProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        const archivedProduct = await Product.findByIdAndUpdate(productId, { isActive: false }, { new: true });

        if (!archivedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product archived successfully", archivedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error archiving product", error: error.message });
    }
};

// Activate Product
module.exports.activateProduct = (req, res) => {
    const productId = req.params.productId;

    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            product.isActive = true;
            return product.save();
        })
        .then((updatedProduct) => {
            res.status(200).json({ message: "Product activated successfully", updatedProduct });
        })
        .catch((error) => {
            res.status(500).json({ message: "Internal server error", error: error.message });
        });
};

