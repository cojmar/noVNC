const exe = require('@angablue/exe')
const fs = require('fs')
const exe_name = "novnc.exe"
const walker = require('walker')
const assets_folder = 'noVNC'
const package_json = require('./package.json')

let ret = []

walker(assets_folder).on('file', (file, stat) => ret.push(file.replace(__dirname, ''))).on('end', () => {
    ret = ret.map(f => `path.join(__dirname,\`${f.split('\\').join('/').replace('/noVNC', 'noVNC')}\`)`)
    fs.writeFileSync('assets.js', ["const path = require('path')", ...ret].join('\n'))
    const build = exe({
        entry: '.',
        out: `./dist/${exe_name}`,
        pkg: ['-C', 'Brotli'], // Specify extra pkg arguments
        version: '0.1',
        target: 'latest-win-x64',
        icon: './appico.ico', // Application icons must be in .ico format
        properties: {
            FileDescription: 'novnc server',
            ProductName: 'novnc',
            LegalCopyright: '404',
            OriginalFilename: exe_name
        }
    })
    console.log('Build start!')
    build.then(() => {
        console.log('Build 1 done!')
        //return 1
        setTimeout(() => {
            require('create-nodew-exe')({ src: `./dist/${exe_name}`, dst: `./dist/${exe_name}`, })
            fs.writeFileSync('./dist/config.json', JSON.stringify(package_json.app_config, null, 2))
            console.log('Build completed!')
        }, 2000);

    })
})

