const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// 載入你的 templates 路由
app.use('/api/templates', require('./routes/templates'))

app.listen(port, () => {
	console.log(`Backend server running at http://localhost:${port}`)
})
