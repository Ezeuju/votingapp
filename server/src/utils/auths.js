const { sign } = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const auths = {
  getToken(user) {
    const payload = {
      currentUser: {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        status: user.status,
        type: user.type,
        role: user.role,
      },
    };

    return {
      access_token: sign(payload, SECRET_KEY, { expiresIn: "2m" }),
      refresh_token: sign(payload, SECRET_KEY, { expiresIn: "5m" }),
    };
  },

  getJWTNoExpiry(data) {
    return sign(
      {
        ...data,
      },
      SECRET_KEY,
    );
  },
};

module.exports = auths;
