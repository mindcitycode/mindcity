import { fsCanvas } from './lib/fscanvas.js'
import { registerKeyboard } from './lib/keyboard.js'
import { rafLoop } from './lib/loop.js'
import { loadImage } from './lib/image.js'
import { createWorld, addComponent, addEntity } from 'bitecs'
import { Position, Orientation, Tile, Animation, Move, pipeline, Commands, Velocity, FootCollider } from './ecs.js'
import { Renderer } from './lib/gl/renderer.js'
import * as people from './people.js'

//const canvas = fsCanvas(400, 400)
//const canvas = fsCanvas(600,650)
const canvas = fsCanvas(320, 240)
canvas.id = 'canvas'
const keyDown = registerKeyboard()

import { extractTileDefinitions, fixImagesPath, getBounds, parseTilemap } from './lib/tilemap.js'
const imagesUrls = [
    "/assets/imgs/tilemap_packed.png"
]
import RBush from 'rbush'
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
    const tilemap0 = parseTilemap(renderer, map0)

    //    const tiles = extractTiles(map0)

    for (let a = 0; a < 4; a++) {
        const tile0 = renderer.makeTile(imagesUrls[0], 16 * (23 + a), 0, 16, 16)
        const tile1 = renderer.makeTile(imagesUrls[0], 16 * (23 + a), 16, 16, 16)
        const tile2 = renderer.makeTile(imagesUrls[0], 16 * (23 + a), 16 * 2, 16, 16)
        const animation0 = renderer.makeAnimation([tile0, tile1, tile0, tile2], 12)
    }
    const world = createWorld()
    world.renderer = renderer
    if (false)
        for (let x = 0; x < 10; x++) {
            const eid = addEntity(world)
            addComponent(world, Position, eid)
            addComponent(world, Orientation, eid)
            addComponent(world, Tile, eid)
            Position.x[eid] = 20 + 10 * x
            Position.y[eid] = 20 + 10 * x
            Orientation.a[eid] = 0
            Tile.index[eid] = 1
        }
    for (let x = 0; x < 10; x++) {
        const eid = addEntity(world)
        addComponent(world, Position, eid)
        addComponent(world, Orientation, eid)
        addComponent(world, Animation, eid)
        addComponent(world, Move, eid)
        addComponent(world, Velocity, eid)
        Position.x[eid] = 10 * x
        Position.y[eid] = 10 * (x + 3)
        Orientation.a[eid] = 0
        Animation.index[eid] = 0
        Animation.tick[eid] = 2 * x
        Velocity.x[eid] = 0.25
        Velocity.y[eid] = 0

    }


    const heroEid = addEntity(world)
    {
        const eid = heroEid
        addComponent(world, Position, eid)
        addComponent(world, Orientation, eid)
        addComponent(world, Animation, eid)
        addComponent(world, Move, eid)
        addComponent(world, Commands, eid)
        addComponent(world, Velocity, eid)
        Position.x[eid] = 160
        Position.y[eid] = 100
        Orientation.a[eid] = 0
        Animation.index[eid] = 0
        Animation.tick[eid] = 0
        Velocity.x[eid] = 0
        Velocity.y[eid] = 0

        addComponent(world, FootCollider, eid)
        FootCollider.x[eid] = -8
        FootCollider.width[eid] = 16
        FootCollider.y[eid] = 6
        FootCollider.height[eid] = 2

    }

    const map0bounds = getBounds(map0)
    world.tilemapOrigin = { x: map0bounds.x, y: map0bounds.y }


    const staticTilemapCollider = new RBush()
    // remove, clear
    const tilemapCollisionItems = tilemap0.getCollisionShapes().map(({ x, y, width, height, source }) => ({
        minX: x,
        minY: y,
        maxX: x + width,
        maxY: y + height,
        source
    }))
    staticTilemapCollider.load(tilemapCollisionItems)
    console.log({ tilemapCollisionItems })

    world.staticTilemapCollider = staticTilemapCollider
    rafLoop((dt, time) => {

        const commands = {
            mapUp: keyDown.KeyW,
            mapLeft: keyDown.KeyA,
            mapDown: keyDown.KeyS,
            mapRight: keyDown.KeyD,
            heroUp: keyDown.ArrowUp,
            heroLeft: keyDown.ArrowLeft,
            heroDown: keyDown.ArrowDown,
            heroRight: keyDown.ArrowRight
        }
        world.commands = commands

        Commands.goUp[heroEid] = commands.heroUp
        Commands.goLeft[heroEid] = commands.heroLeft
        Commands.goDown[heroEid] = commands.heroDown
        Commands.goRight[heroEid] = commands.heroRight

        const speed = 1
        const dx = speed * commands.mapLeft ? -1 : commands.mapRight ? 1 : 0
        const dy = speed * commands.mapUp ? -1 : commands.mapDown ? 1 : 0
        world.tilemapOrigin.x += dx
        world.tilemapOrigin.y += dy

        //console.log(keyDown)
        renderer.cls()
        tilemap0.render({
            x: world.tilemapOrigin.x,
            y: world.tilemapOrigin.y
        })
        pipeline(world)
        /*
                const result = staticTilemapCollider.search({
                    minX: Position.x[heroEid] - 8,
                    maxX: Position.x[heroEid] + 8,
                    minY: Position.y[heroEid] + 6,
                    maxY: Position.y[heroEid] + 8
                });
                if (result.length) {
                    console.log(performance.now(),result)
                }
        */
        renderer.flush()
    })
}

go666()


/* 
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
//go() */