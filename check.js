#!/usr/bin/env node

process.stdin.on("data", (chunk) => {
  const data = JSON.parse(chunk)
  const version = data.version
  const faux_version = {"ref": "c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2"}
  if(version == faux_version) {
    console.log('[]')
  }
  console.log('[{"ref": "c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2"}]')
  process.exit(0)
})
