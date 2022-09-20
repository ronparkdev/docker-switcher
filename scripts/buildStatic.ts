
import sharp from 'sharp'

import path from 'path'
import fs from 'fs'

async function buildStaticImages() {
  const imageSrcDirPath = path.resolve(__dirname, '../assets/images')
  const imageDistDirPath = path.resolve(__dirname, '../build/images')

  if (fs.existsSync(imageDistDirPath)) {
    fs.rmdirSync(imageDistDirPath, { recursive:true })
  }
  fs.mkdirSync(imageDistDirPath, { recursive:true })

  // tray icon
  fs.readdirSync(imageSrcDirPath)
    .filter(fileName => fileName.startsWith('tray_icon_'))
    .forEach(async (fileName) => {
      await Promise.all([20].map(async (width) => {
        const newFileName = `${path.parse(fileName).name}_s${width}${path.extname(fileName)}`

        await sharp(path.resolve(imageSrcDirPath, fileName))
          .resize(20)
          .toFile(path.resolve(imageDistDirPath, newFileName))
      }))
    })
}

void buildStaticImages()

