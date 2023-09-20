const package_json = require('./package.json')
const fs = require('fs')
const path = require('path')
const websockify = require('@maximegris/node-websockify')
const express = require('express')
const httpProxy = require('http-proxy')
const SysTray = require('systray')
const open = require('opn')
require('./assets.js')

const config = (fs.existsSync('config.json')) ? JSON.parse(fs.readFileSync('config.json')) : package_json.app_config

const app = express()
const server = app.listen(config.http_port, () => console.log(`noVNC Interface listening at http://localhost:${config.http_port}`)) // Start HTTP server
const proxy = httpProxy.createProxyServer({ target: `http://${config.websockets.host}:${config.websockets.port}`, ws: true })

app.use('/', express.static(path.join(__dirname, 'noVNC')))
app.get('/', (req, res) => res.redirect(301, '/vnc.html'))
server.on('upgrade', (req, socket, head) => proxy.ws(req, socket, head))

websockify({
    source: `${config.websockets.host}:${config.websockets.port}`,
    target: `${config.tcp.host}:${config.tcp.port}`,
})


const systray = new SysTray.default({
    menu: {
        // you should using .png icon in macOS/Linux, but .ico format in windows
        icon: Buffer.from(fs.readFileSync(path.join(__dirname, 'noVNC/app/images/icons/novnc.ico'))).toString('base64'),
        tooltip: `noVNC: ${config.http_port}`,
        items: [
            {
                title: `webproxy: ${config.http_port} -> ${config.tcp.port}`,
                checked: false,
                enabled: false
            },
            {
                title: `noVNC: http://localhost:${config.http_port}`,
                checked: false,
                enabled: true
            },
            {
                title: "Exit",
                checked: false,
                enabled: true
            }]
    },
    debug: false,
    copyDir: true, // copy go tray binary to outside directory, useful for packing tool like pkg.
})

systray.onClick(action => {
    if (action.seq_id === 1) open(`http://localhost:${config.http_port}`)
    else if (action.seq_id === 2) systray.kill()
})

