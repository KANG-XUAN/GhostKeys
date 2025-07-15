const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

const BASE_PATH = path.join(__dirname, '../../public/textTemplates')

console.log('templates.js 目前目錄:', __dirname)
console.log('BASE_PATH:', BASE_PATH)

// Utility: 取得某資料夾下 en/ch 的 txt 檔案
function readLangFiles(baseDir) {
	const result = {}
	const langs = ['en', 'ch']

	langs.forEach((lang) => {
		const langPath = path.join(baseDir, lang)
		if (fs.existsSync(langPath) && fs.lstatSync(langPath).isDirectory()) {
			const files = fs
				.readdirSync(langPath)
				.filter((f) => f.endsWith('.txt'))
			result[lang] = files
		} else {
			result[lang] = []
		}
	})

	return result
}

// /list：取得主路徑和 models 子路徑的檔案
router.get('/list', (req, res) => {
	try {
		const result = {
			main: readLangFiles(path.join(BASE_PATH, 'main')),
			models: {}
		}

		const modelsBase = path.join(BASE_PATH, 'models')

		if (fs.existsSync(modelsBase)) {
			const modelFolders = fs
				.readdirSync(modelsBase)
				.filter((name) => {
					const fullPath = path.join(modelsBase, name)
					return fs.lstatSync(fullPath).isDirectory()
				})

			modelFolders.forEach((folder) => {
				const fullPath = path.join(modelsBase, folder)
				result.models[folder] = readLangFiles(fullPath)
			})
		}

		res.json(result)
	} catch (e) {
		console.error('讀取資料夾失敗:', e)
		res.status(500).json({ error: '讀取資料夾失敗' })
	}
})

// /file：取得單一文章檔案內容
router.get('/file', (req, res) => {
	const { path: reqPath, lang, name } = req.query

	if (!reqPath || !lang || !name) {
		return res.status(400).send('缺少必要參數 path, lang, 或 name')
	}

	const targetPath = path.join(BASE_PATH, reqPath, lang, name)

	if (!fs.existsSync(targetPath)) {
		return res.status(404).send('找不到檔案')
	}

	res.sendFile(targetPath)
})

module.exports = router
