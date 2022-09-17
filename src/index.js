import { fsCanvas } from './lib/fscanvas.js'
import { registerKeyboard } from './lib/keyboard.js'
import { rafLoop } from './lib/loop.js'
import { loadImage } from './lib/image.js'
import { createWorld, addComponent, addEntity } from 'bitecs'
import { Position, Orientation, Tile, Animation, Move, pipeline } from './ecs.js'
import { Renderer } from './lib/gl/renderer.js'
import * as people from './people.js'

const canvas = fsCanvas(600, 600)
//const canvas = fsCanvas(800, 800)
canvas.id = 'canvas'
const keyDown = registerKeyboard()

import { extractTiles, fixImagesPath, tilemapRenderer } from './lib/tilemap.js'
const imagesUrls = [
    "/assets/imgs/tilemap_packed.png"
]
/*
const go667 = async () => {
    
    

    console.log(map0.tilesets)
    console.log({ tiles })  
}
go667()
*/
const go666 = async () => {
    const renderer = await Renderer(canvas, imagesUrls)

    const map0 = await fetch('/assets/data/map0.json').then(x => x.json())
    fixImagesPath(map0, imagesUrls)
    const renderTilemap = tilemapRenderer(renderer, map0)

    //    const tiles = extractTiles(map0)

    const tile0 = renderer.makeTile(imagesUrls[0], 0, 0, 32, 32)
    const tile1 = renderer.makeTile(imagesUrls[0], 64, 64, 32, 32)

    const animation0 = renderer.makeAnimation([tile0, tile1], 10)

    const world = createWorld()
    world.renderer = renderer

    for (let x = 0; x < 10; x++) {
        const eid = addEntity(world)
        addComponent(world, Position, eid)
        addComponent(world, Orientation, eid)
        addComponent(world, Tile, eid)
        Position.x[eid] = 10 * x
        Position.y[eid] = 10
        Orientation.a[eid] = 0
        Tile.index[eid] = 1
    }
    for (let x = 0; x < 10; x++) {
        const eid = addEntity(world)
        addComponent(world, Position, eid)
        addComponent(world, Orientation, eid)
        addComponent(world, Animation, eid)
        addComponent(world, Move, eid)
        Position.x[eid] = 10 * x
        Position.y[eid] = 10 * (x + 3)
        Orientation.a[eid] = 0
        Animation.index[eid] = animation0
        Animation.tick[eid] = 2 * x
    }

    rafLoop((dt, time) => {
        renderer.cls()
        renderTilemap()
        pipeline(world)
        renderer.flush()
    })
}

go666()



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