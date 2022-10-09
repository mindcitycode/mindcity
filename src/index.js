import { fsCanvas } from './lib/fscanvas.js'
import { registerKeyboard } from './lib/keyboard.js'
import { rafLoop } from './lib/loop.js'
import { loadImage } from './lib/image.js'
import { createWorld, addComponent, addEntity } from 'bitecs'
import { Position, Orientation, Tile, Animation, Move, pipeline, Commands, Velocity, FootCollider, CultFollower, CULT_BLACK, CULT_COUNT, CULT_BLOND, CULT_HELMET } from './ecs.js'
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
import { clamp } from './lib/clamp.js'

import {Persisted} from './lib/persist.js' 
const storedHeroPosition = Persisted('hero-position')

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

    for (let cultIndex = 0; cultIndex < CULT_COUNT; cultIndex++) {
        const top = 3 * 16 * cultIndex
        for (let a = 0; a < 4; a++) {
            const tile0 = renderer.makeTile(imagesUrls[0], 16 * (23 + a), top + 0 * 16, 16, 16)
            const tile1 = renderer.makeTile(imagesUrls[0], 16 * (23 + a), top + 1 * 16, 16, 16)
            const tile2 = renderer.makeTile(imagesUrls[0], 16 * (23 + a), top + 2 * 16, 16, 16)
            const animation0 = renderer.makeAnimation([tile0, tile1, tile0, tile2], 12)
            const animation1 = renderer.makeAnimation([tile0], 1)
        }
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
        addComponent(world, Commands, eid)
        addComponent(world, FootCollider, eid)
        addComponent(world, CultFollower, eid)
        FootCollider.minX[eid] = -5
        FootCollider.maxX[eid] = 6
        FootCollider.minY[eid] = 6
        FootCollider.maxY[eid] = 8
        if (x < 5) {
            CultFollower.index[eid] = x % CULT_COUNT
            Position.x[eid] = 110 +10 * x
            Position.y[eid] = 60 + 10 * (x + 3)
            //  Orientation.a[eid] = 0
            //  Animation.index[eid] = 0
            Animation.tick[eid] = 2 * x
            // Velocity.x[eid] = 0.25
            //Velocity.y[eid] = 0
            Commands.goRight[eid] = 1

        } else {
            CultFollower.index[eid] = 0
            Position.x[eid] = 200 + 10 * x
            Position.y[eid] = 10 * (x + 3)
            Commands.goDown[eid] = 1
            Commands.goLeft[eid] = 1
            Animation.tick[eid] = 2 * x

        }
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
        addComponent(world, FootCollider, eid)
        addComponent(world, CultFollower, eid)

        const previousPos = storedHeroPosition.get() || ({ x: 160, y: 100 })

        Position.x[eid] = previousPos.x
        Position.y[eid] = previousPos.y
        Orientation.a[eid] = 0
        // Animation.index[eid] = 0
        // Animation.tick[eid] = 0
        Velocity.x[eid] = 0
        Velocity.y[eid] = 0

        FootCollider.minX[eid] = -5
        FootCollider.maxX[eid] = 6
        FootCollider.minY[eid] = 6
        FootCollider.maxY[eid] = 8
        CultFollower.index[eid] = CULT_HELMET

    }

    const map0bounds = getBounds(map0)

    world.tilemapOrigin = { x: map0bounds.minX, y: map0bounds.minY }

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

    world.staticTilemapCollider = staticTilemapCollider

    const CameraFollow = () => {
        const must = {}
        return function () {
            const heroScreenPosition = {
                x: Position.x[heroEid] - world.tilemapOrigin.x,
                y: Position.y[heroEid] - world.tilemapOrigin.y,
            }
            const fivepart = {
                x: Math.floor(5 * heroScreenPosition.x / canvas.width),
                y: Math.floor(5 * heroScreenPosition.y / canvas.height)
            }
            if (fivepart.x <= 0) {
                must.mapLeft = true
            } else if (fivepart.x >= 4) {
                must.mapRight = true
            } else if (fivepart.x === 3) {
                must.mapLeft = false
            } else if (fivepart.x === 1) {
                must.mapRight = false
            }
            if (fivepart.y <= 0) {
                must.mapUp = true
            } else if (fivepart.y >= 4) {
                must.mapDown = true
            } else if (fivepart.y === 3) {
                must.mapUp = false
            } else if (fivepart.y === 1) {
                must.mapDown = false
            }
            return must
        }
        //     console.log(fivepart)
    }
    const cameraFollow = CameraFollow()

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

        const mapMust = cameraFollow()

        commands.mapLeft = commands.mapLeft || mapMust.mapLeft
        commands.mapRight = commands.mapRight || mapMust.mapRight
        commands.mapUp = commands.mapUp || mapMust.mapUp
        commands.mapDown = commands.mapDown || mapMust.mapDown



        Commands.goUp[heroEid] = commands.heroUp
        Commands.goLeft[heroEid] = commands.heroLeft
        Commands.goDown[heroEid] = commands.heroDown
        Commands.goRight[heroEid] = commands.heroRight

        const speed = 1
        const dx = speed * commands.mapLeft ? -1 : commands.mapRight ? 1 : 0
        const dy = speed * commands.mapUp ? -1 : commands.mapDown ? 1 : 0

        world.tilemapOrigin.x += dx
        world.tilemapOrigin.y += dy

        world.tilemapOrigin.x = clamp(world.tilemapOrigin.x, map0bounds.minX, map0bounds.maxX - canvas.width)
        world.tilemapOrigin.y = clamp(world.tilemapOrigin.y, map0bounds.minY, map0bounds.maxY - canvas.height)


        //console.log(keyDown)
        renderer.cls()
        tilemap0.render({
            x: world.tilemapOrigin.x,
            y: world.tilemapOrigin.y
        })


        pipeline(world)
        storedHeroPosition.set({
            x: Position.x[heroEid],
            y: Position.y[heroEid]
        })

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