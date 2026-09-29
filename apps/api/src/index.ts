import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/ready', (req, res) => {
  res.json({ status: 'ready' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
  });
}

export default app;
