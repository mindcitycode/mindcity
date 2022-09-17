import { fsCanvas } from './lib/fscanvas.js'
import { registerKeyboard } from './lib/keyboard.js'
import { rafLoop } from './lib/loop.js'
import { loadImage } from './lib/image.js'

import { TinySprite } from "./lib/gl/sprite.js";
import { CreateTexture } from "./lib/gl/utils.js"

import * as people from './people.js'

const canvas = fsCanvas(400, 200)
canvas.id = 'canvas'
const keyDown = registerKeyboard()

import { createWorld, addComponent, addEntity } from 'bitecs'
import { Position, Orientation, Sprite, pipeline } from './ecs.js'

import { SpriteRenderer } from './lib/gl/wrap.js'

const go666 = async () => {
    const imagesUrls = [
        "/assets/imgs/tilemap_packed.png"
    ]
    const renderer = await SpriteRenderer(canvas, imagesUrls)
    const tile0 = renderer.makeTile(imagesUrls[0], 0, 0, 32, 32)
    const tile1 = renderer.makeTile(imagesUrls[0], 64, 64, 32, 32)
    console.log({tile0})
    console.log({ renderer })
    renderer.cls()
    renderer.putTile(tile0,10,10,0)
    renderer.putTile(tile1,10,60,0)
    renderer.flush()
}
go666()
const go12 = async () => {

    const imagesUrls = [
        "/assets/imgs/tilemap_packed.png"
    ]

    var renderer = TinySprite(canvas)
    renderer.bkg(0.227, 0.227, 0.227);

    const images = await Promise.all(imagesUrls.map(loadImage))
    const textures = images.map(image => CreateTexture(renderer.g, image, image.width, image.height))



    const world = createWorld()
    world.renderer = renderer
    world.textures = textures

    const eid = addEntity(world)
    addComponent(world, Position, eid)
    addComponent(world, Orientation, eid)
    addComponent(world, Sprite, eid)
    Position.x[eid] = 10
    Position.y[eid] = 10
    Orientation.a[eid] = 0

    Sprite.textureNum[eid] = 0
    Sprite.x[eid] = 0
    Sprite.y[eid] = 0
    Sprite.width[eid] = 32
    Sprite.height[eid] = 32

    rafLoop((dt, time) => {
        pipeline(world)
    })

}
//go12()




const go = async () => {

    const image = await loadImage("/assets/imgs/tilemap_packed.png")


    //console.log(people.animationTiles)


    people.animationTiles.filter(({ kind, direction, step, rect }) => {
        return (kind === 'helmet') && (direction === 'down')
    }).forEach(({ kind, direction, step, rect }, idx) => {
        $ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height, idx * 32, 0, rect.width, rect.height)
    })

    const makeAnimation = (_kind, _direction, _movement) => {
        const definition = people.animations.filter(({ kind, direction, movement }) => {
            return (kind === _kind) && (direction === _direction) && (movement === _movement)
        }).shift()
        const rects = definition.rects
        const period = definition.period

        let step = 0
        const update = () => step++
        const draw = (x, y) => {
            const rect = rects[Math.floor(step / period) % rects.length]
            $ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height, x, y, rect.width, rect.height)
        }

        return { update, draw }
    }

    const anim0 = makeAnimation('helmet', 'down', 'walk')
    //console.log(people.animations)


    rafLoop((dt, time) => {
        anim0.update()
        anim0.draw(50, 50)
        // console.log(dt, time)
    })

}
//go()