import express from 'express';

const router = express.Router();

router.post('/users/signout', async (req, res) => {
  req.session = null;
  res.send({});
});

export { router as signoutRouter };
