export const getHome = (req, res) => {
  //got after decoding token in middleware
  const { username, role, email } = req.user;
  res.status(200).json({ message: "hello world", username, role, email });
};
