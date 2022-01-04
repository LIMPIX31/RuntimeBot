export abstract class Logger {

  public static info(message: any): void {
    this.log('info', message)
  }

  public static warn(message: any): void {
    this.log('warn', message)
  }

  public static error(message: any): void {
    this.log('error', message)
  }

  public static success(message: any): void {
    this.log('success', message)
  }

  public static fatal(message: any): void {
    this.log('fatal', message)
  }

  private static log(type: 'info' | 'warn' | 'error' | 'fatal' | 'success', message: any): void {
    if (typeof message !== 'string') {
      message = JSON.stringify(message, null, 2)
    }
    if (message.includes('\n')) {
      const messages = message.split('\n')
      for (let imessage of messages) {
        this.log(type, imessage)
      }
      return
    }
    let symbol: string = ''
    let color: string = ''
    switch (type) {
      case 'info':
        color = '\x1b[34m'
        symbol = '[i]'
        break
      case 'success':
        color = '\x1b[32m'
        symbol = '[✔]'
        break
      case 'warn':
        color = '\x1b[33m'
        symbol = '[⚠]'
        break
      case 'error':
        color = '\x1b[31m'
        symbol = '[✖]'
        break
      case 'fatal':
        color = '\x1b[31m'
        symbol = '[✖]'
        break
    }
    let logString: string = '%symbol% \x1b[35m❯\x1b[0m %fatalcolor%%message%\x1b[0m'
    logString = logString.replaceAll('%symbol%', `${color}${symbol}\x1b[0m`)
    logString = logString.replaceAll('%message%', message)
    logString =logString.replaceAll('%fatalcolor%', type === 'fatal' ? '\x1b[31m' : '')
    logString = logString.replaceAll('%type%', (_ => {
      let r: string = ''
      switch (type) {
        case 'info':
          r += '\x1b[34mINFO\x1b[0m'
          break
        case 'warn':
          r += '\x1b[33mWARN\x1b[0m'
          break
        case 'error':
          r += '\x1b[31mERROR\x1b[0m'
          break
        case 'fatal':
          r += '\x1b[36m\x1b[41mFATAL\x1b[0m'
          break
      }
      return r
    })())
    console.log(logString)
  }

}
