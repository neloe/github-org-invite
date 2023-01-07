require('dotenv').config()
const { Octokit } = require("@octokit/rest")
const http = require('http')
const dots = require('dot').process({path: "./views"})
const port = process.env.PORT || 8000
const host = process.env.HOST || 'localhost'

const octokit = new Octokit({auth:process.env.ACCESS_TOKEN})

function listener(req, res) {
    console.log(req.url)
    if (req.url === '/' && req.method === 'GET')
    {
        octokit.rest.orgs.get({ org:process.env.ORG_NAME}).then(e=>{
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(dots.index({avatar: e.data.avatar_url}))
        })
    }
    
}

const server = http.createServer(listener)
server.listen(port, host, () => {
    console.log(`server running on http://${host}:${port}`)
})
