require('dotenv').config()
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({auth:process.env.ACCESS_TOKEN})
console.log(octokit.rest.orgs.createInvitation('/'+process.env.ORG_NAME, {invitee_id:'neloe'}).then((e)=>{console.log(e)}))
