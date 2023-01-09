require('dotenv').config()
const { Octokit } = require("@octokit/rest")
const http = require('http')
const dots = require('dot').process({path: "./views"})
const port = process.env.PORT || 8000
const host = process.env.HOST || 'localhost'

const octokit = new Octokit({auth:process.env.ACCESS_TOKEN})

function listener(req, res) {
    //console.log(req.url)
    //console.log(req.method)
    if (req.url === '/' && req.method === 'GET')
    {
        octokit.rest.orgs.get({ org:process.env.ORG_NAME}).then(e=>{
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(dots.index({avatar: e.data.avatar_url, org:process.env.ORG_NAME}))
        })
    }
    if (req.url === '/success' && req.method === 'GET')
    {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(dots.success({avatar: e.data.avatar_url, org:process.env.ORG_NAME}))
    }
    if (req.url === '/invite' && req.method === 'POST')
    {
        //console.log(req.body)
        let body = ''
        req.on('data', data=>{
            body += data
            if (body.length >= 1e6)
                req.connection.destroy()
        })
        req.on('end', ()=>{
            const payload = JSON.parse(body)
            //console.log(payload.user)
            octokit.rest.users.getByUsername({username:payload.user}).then(u=>{
                octokit.rest.orgs.createInvitation({org:process.env.ORG_NAME, invitee_id:u.data.id}).then(e=>{
                    //console.log(e)
                    res.writeHead(e.status)
                    res.end()
                    
                }).catch (e=>{
                    console.log(e)
                    res.setHeader('Content-Type', 'application/json')
                    res.writeHead(e.status)
                    res.end(JSON.stringify(e.response.data)) 
                })
            })
            
        })
    }
    
}

const server = http.createServer(listener)
server.listen(port, host, () => {
    console.log(`server running on http://${host}:${port}`)
})
