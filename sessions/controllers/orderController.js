//[SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');
const User = require("../models/User");
const Order = require("../models/Order");
const auth = require("../auth");

const { errorHandler } = auth;
