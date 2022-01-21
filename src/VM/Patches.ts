import { tlogo } from './Copyright'

export const Patches = {
  SuppressGlobalContext: `${tlogo.split('\n').map((line) => `// ${line}`).join('\n')}
// Generated by RuntimeBot
// (c) RuntimeBot 2022

'use strict'
// @ts-ignore
require = () => {
  throw new Error('\\'require\\' Are not allowed by RuntimeBot Policy')
}
// @ts-ignore
process = { exit: process.exit, stdout: process.stdout, stderr: process.stderr }

`
}
