//[SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');
const User = require("../models/User");
const Cart = require("../models/Cart");
const auth = require("../auth");

const { errorHandler } = auth;

