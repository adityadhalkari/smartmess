// ─── SmartMess Backend - Complete Server ─────────────────────────────────────
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
// ─── DB CONNECTION ────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartmess', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log(' MongoDB Connected'))
  .catch(err => console.error(' MongoDB Error:', err));
// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/messes',  require('./routes/messes'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users',   require('./routes/users'));
app.use('/api/menu',    require('./routes/menu'));
// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'SmartMess Backend Running ',
    version: '1.0.0',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/messes',
      'POST /api/messes          (owner/admin)',
      'PUT  /api/messes/:id      (owner/admin)',
      'DELETE /api/messes/:id    (admin)',
      'GET  /api/messes/:id/reviews',
      'POST /api/reviews         (student)',
      'DELETE /api/reviews/:id   (admin/author)',
      'GET  /api/menu/:messId',
    ],
      'PUT  /api/menu/:messId   (owner)':
      'GET  /api/users           (admin)',
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`))