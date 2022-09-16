import { fsCanvas } from './fscanvas.js'
import { registerKeyboard } from './keyboard.js'
import { rafLoop } from './loop.js'

const canvas = fsCanvas(800, 600)
const keyDown = registerKeyboard()

rafLoop( (dt,time) => {
    console.log(dt,time)
})