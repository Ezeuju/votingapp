const fileService = require("../../services/files");

const { sendResponse } = require("../../utils/helpers");
const { asyncControllerWrapper } = require("../../utils/wrappers");

const controllers = {
  create: asyncControllerWrapper(async (req, res) => {
    const user = req.user.currentUser;

    const data = await fileService.create(req.file, user);
    sendResponse(201, `Successful.`, data)(req, res);
  }),
};

module.exports = controllers;
