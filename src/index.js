import { fsCanvas } from './lib/fscanvas.js'
import { registerKeyboard } from './lib/keyboard.js'
import { rafLoop } from './lib/loop.js'
import { loadImage } from './lib/image.js'
import * as people from './people.js'

const canvas = fsCanvas(400, 200)
canvas.id = 'canvas'
//const $ctx = canvas.getContext('2d')
const keyDown = registerKeyboard()


import { TinySprite } from "./lib/gl/sprite.js";
import { CreateTexture } from "./lib/gl/utils.js"

import { createWorld,addComponent, addEntity, defineComponent, defineQuery, pipe, Types } from 'bitecs'

const Position = defineComponent({
    x: Types.f32,
    y: Types.f32,
})
const Orientation = defineComponent({
    a: Types.f32
})
const Sprite = defineComponent({
    textureNum: Types.i8,
    x: Types.i32,
    y: Types.i32,
    width: Types.i32,
    height: Types.i32,
})

const displayQuery = defineQuery([Position, Orientation, Sprite])
const displaySystem = world => {
    const ents = displayQuery(world)
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i]
        //  canvas.img ....
    }
}

const pipeline = pipe(displaySystem)

const world = createWorld()
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

pipeline(world)


const go3 = async (_canvas) => {
    var canvas = TinySprite(_canvas)
    const gl = canvas.g

    function Sprite(x, y, texture, frameX, frameY, frameW, frameH) {
        this.positionX = x;
        this.positionY = y;
        this.width = frameW;
        this.height = frameH;
        this.texture = texture;
        this.speedX = 0;
        this.speedY = 0;
        this.rotation = 0;
        this.u0 = frameX / texture.width;
        this.v0 = frameY / texture.height;
        this.u1 = this.u0 + (frameW / texture.width);
        this.v1 = this.v0 + (frameH / texture.height);
        this.halfWidth = frameW / 2;
    }

    canvas.bkg(0.227, 0.227, 0.227);

    const image = await loadImage("/assets/imgs/tilemap_packed.png")
    const kittenTexture = CreateTexture(gl, image, image.width, image.height);
    const sprites = [
        new Sprite(0, 0, kittenTexture, 0, 0, 32, 32)
    ]
    const draw = () => {
        canvas.cls();
        for (let i = 0, l = sprites.length; i < l; i++) {
            const sprite = sprites[i]
            canvas.img(
                // Texture
                sprite.texture,
                // Position X 
                -sprite.halfWidth,
                // Position Y
                0,
                // Width
                sprite.width,
                // Height
                sprite.height,
                // Rotation
                sprite.rotation,
                // Translation X
                sprite.positionX,
                // Translation Y
                sprite.positionY,
                // Scale X
                1,
                // Scale Y
                1,
                // UV0
                sprite.u0,
                sprite.v0,
                // UV1
                sprite.u1,
                sprite.v1
            );
        }
        canvas.flush()
    }

    rafLoop((dt, time) => {
        sprites[0].positionX += 1
        console.log(sprites[0])
        draw()
        //console.log(dt, time)
    })



}
go3(canvas)

//import { gocats } from './cats.js'
//gocats(canvas)

//rafLoop((dt, time) => {
//console.log(dt, time)
//})










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