import { defineComponent, defineQuery, pipe, Types } from 'bitecs'

export const Follower = defineComponent({
    cultIndex : Types.i8
})
export const Position = defineComponent({
    x: Types.f32,
    y: Types.f32,
})
export const Orientation = defineComponent({
    a: Types.f32
})
export const Sprite = defineComponent({
    textureNum: Types.i8,
    x: Types.i32,
    y: Types.i32,
    width: Types.i32,
    height: Types.i32,
})

const displayQuery = defineQuery([Position, Orientation, Sprite])
const displaySystem = world => {

    const renderer = world.renderer
    const textures = world.renderer.textures

    renderer.cls();

    const ents = displayQuery(world)
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i]

        const texture = world.textures[Sprite.textureNum[eid]]
        const halfWidth = Sprite.width[eid] / 2
        const u0 = Sprite.x[eid] / texture.width;
        const v0 = Sprite.y[eid] / texture.height;
        const u1 = u0 + (Sprite.width[eid] / texture.width);
        const v1 = v0 + (Sprite.height[eid] / texture.height);
        renderer.img(
            // Texture
            texture,
            // Position X 
            -halfWidth,
            // Position Y
            0,
            // Width
            Sprite.width[eid],
            // Height
            Sprite.height[eid],
            // Rotation
            Orientation.a[eid],
            // Translation X
            Position.x[eid],
            // Translation Y
            Position.y[eid],
            // Scale X
            1,
            // Scale Y
            1,
            // UV0
            u0,
            v0,
            // UV1
            u1,
            v1
        );
    }
    renderer.flush()
}


//  canvas.img ....

export const pipeline = pipe(displaySystem)
