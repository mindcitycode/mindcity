import { fsCanvas } from './fscanvas.js'
import { registerKeyboard } from './keyboard.js'
import { rafLoop } from './loop.js'

const canvas = fsCanvas(800, 600)
const $ctx = canvas.getContext('2d')

$ctx.fillStyle = 'blue'
$ctx.fillRect(30, 30, 40, 40)
const keyDown = registerKeyboard()

const loadImage = src => {
    return new Promise((accept, reject) => {
        const image = new Image()
        image.onload = () => accept(image)
        image.onerror = reject
        image.src = src
    })
}

loadImage("/assets/imgs/tilemap_packed.png")
    .then(image => {
        $ctx.drawImage(image, 20, 20)
    })
/*
rafLoop((dt, time) => {
    // console.log(dt, time)
})
*/