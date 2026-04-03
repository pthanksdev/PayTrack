const app = require('./server');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PayTrack API Server running on port ${PORT}`);
});