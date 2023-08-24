"use strict";

class AccessController {
  register = async (req, res, next) => {
    try {
      console.log(`[P]::register::`, req.body);
      res.status(201).json({
        code: 201,
        metadata: {
          message: "Register successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
