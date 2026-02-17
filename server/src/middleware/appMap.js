const { adminModel, userModel } = require("../models");
const validation = require("../services/validation/auth");
const adminService = require("../services/admins");
const userService = require("../services/users");

const appMap = {
  admin: {
    type: "admin",
    userExistFn: adminService.adminExist,
    Model: adminModel,
    validation: {
      login: validation.adminLogin,
    },
    default_status: "active",
  },
  user: {
    type: "user",
    userExistFn: userService.userExist,
    Model: userModel,
    validation: {
      register: validation.userRegister,
      login: validation.userLogin,
    },
    default_status: "active",
  },
};

module.exports = appMap;
