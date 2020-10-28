const jwt = require("jsonwebtoken");
var tokenKey = "fintech1234!";

const authMiddleware = (req, res, next) => {
  const token = req.headers["ourtoken"] || req.query.token;
  console.error("사용자가 전송한 토큰 : ", token);
  if (!token) {
    return res.status(403).json({
      server: "마이데이터 서버",
      success: false,
      message: "not logged in",
    });
  }

  const p = new Promise((resolve, reject) => {
    jwt.verify(token, tokenKey, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });

  const onError = (error) => {
    console.log(error);
    res.status(403).json({
      server: "마이데이터 서버",
      success: false,
      message: error.message,
    });
  };

  p.then((decoded) => {
    req.decoded = decoded;
    next();
  }).catch(onError);
};

module.exports = authMiddleware;