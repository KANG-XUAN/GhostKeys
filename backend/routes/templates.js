const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

const BASE_PATH = path.join(__dirname, '../../public/textTemplates')

console.log('templates.js 目前目錄:', __dirname);
console.log('BASE_PATH:', BASE_PATH);

router.get('/api/health', (req, res) => {
  res.send('Backend is running')
})


router.get('/list', (req, res) => {
	try {
		console.log('讀取文字檔案列表...');
		const main = fs.readdirSync(BASE_PATH).filter(f => f.endsWith('.txt'));
		const models = fs.readdirSync(path.join(BASE_PATH, 'models')).filter(f => f.endsWith('.txt'));
		console.log('main:', main);
		console.log('models:', models);

		res.json({ main, models });
	} catch (e) {
		console.error('讀取資料夾失敗:', e);
		res.status(500).json({ error: '讀取資料夾失敗' });
	}
});


router.get('/file', (req, res) => {
	const { type, name } = req.query
	const folder = type === 'models' ? 'models' : ''
	const filePath = path.join(BASE_PATH, folder, name)

	if (!fs.existsSync(filePath)) {
		return res.status(404).send('找不到檔案')
	}

	res.sendFile(filePath)
})

module.exports = router
