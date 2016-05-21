#!/usr/bin/env node

var exec = require("child_process").exec,
  fs = require("fs"),
  yaml = require("js-yaml")

process.stdin.on("data", (chunk) => {
  const data = JSON.parse(chunk)
  const source = data.source
  if(!source) {
    console.error("Please configure the resource source.")
    process.exit(1)
  }
  const url = source.url
  if(!url) {
    console.error("Please specify a URL.")
    process.exit(1)
  }
  const access_key = source.access_key
  if(!access_key) {
    console.error("Please specify an access_key.")
    process.exit(1)
  }
  const secret_key = source.secret_key
  if(!secret_key) {
    console.error("Please specify a secret_key.")
    process.exit(1)
  }
  const params = data.params
  if(!params) {
    console.error("Please specify resource parameters.")
    process.exit(1)
  }
  const project = params.project
  if(!project) {
    console.error("Please specify a project.")
    process.exit(1)
  }
  const service = params.service
  var cmdLine = `rancher-compose --project-name ${project} --url ${url} --access-key ${access_key} --secret-key ${secret_key} `
  if(params.file)
    cmdLine += `--file ${params.file} `
  cmdLine += "up -d "
  if(params.pull)
    cmdLine += "--pull "
  if(params.upgrade) {
    if(params.upgrade == "force")
      cmdLine += "--force-upgrade "
    else if(params.upgrade == "rollback")
      cmdLine += "--rollback "
    else if(params.upgrade == "confirm")
      cmdLine += "--confirm-upgrade "
    else if(params.upgrade == true)
      cmdLine += "--upgrade "
    else {
      console.error("`upgrade` param ("+params.upgrade+") must be `true`, `force`, `rollback` or confirm.")
      process.exit(1)
    }
  }
  const path = params.path
  if(!path) {
    console.error("Please specify a path parameter.")
    process.exit(1)
  }
  const cwd = `${process.argv[2]}/${path}`
  if(!fs.existsSync(cwd)) {
    console.error(`Input referenced in ${path} does not exist. Is there a missing "get" step or "input" configuration for this job?`)
    process.exit(1)
  }
  const environment = params.environment
  let env = {}
  if(environment)
    env = yaml.safeLoad(environment)
  cmdLine += service
  exec(cmdLine, {cwd: cwd, env: env}, (err, stdout, stderr) => {
    console.error(stdout.toString())
    console.error(stderr.toString())
    if(err || stderr.toString() != "") {
      process.exit(1)
    }
    else {
      console.log(JSON.stringify({version: {timestamp: new Date().getTime().toString()}}))
      process.exit(0)
    }
  })
})
