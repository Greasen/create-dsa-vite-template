import gradient from 'gradient-string'

export function logger(val: string) {
  console.log(gradient('#9CECFB', '#65C7F7', '#001ad4')(val))
}
