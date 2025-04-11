// check username and password in the post(login) request
// if exist, create new JWt
//send back to front end

// set up authenticatoin so that only the request with jwt can access the dashboard
const jwt = require('jsonwebtoken');
const CustomAPIError = require('../errors/custom-error');
const login = async (req, res) => {
  const { username, password } = req.body;

  // mongoose validation
  // joi
  //  check from the controllers
  if (!username || !password) {
    throw new CustomAPIError(
      'please provide a correct password or username',
      400
    );
  }
  //for just demo. normaly it is provided by DB
  // just for demo in production, use strong, unguessable, long, complex  string value
  const id = new Date().getDate();

  //for better exprience of user, try to keep payload small.
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  res.status(200).json({ msg: 'user created', token });
};

const dashboard = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomAPIError('no token provided', 401);
  }

  const token = authHeader.split(' ')[1];
  // const token = authHeader.split('')[1]; not correct
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const luckyNumber = Math.floor(Math.random() * 100);
    res.status(200).json({
      msg: `hello, ${decoded.username}`,
      secret: `here is your authorized data. your lucky number is ${luckyNumber}`,
    });
  } catch (error) {
    throw new CustomAPIError('note authorized to access this route', 401);
  }
};

module.exports = { login, dashboard };
