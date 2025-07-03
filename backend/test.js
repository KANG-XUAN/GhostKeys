const express = require('express')
const app = express()
const port = 3000

app.get('/api/health', (req, res) => {
  res.send('Backend is running')
})

app.listen(port, () => {
  console.log(`Test server running on http://localhost:${port}`)
})
