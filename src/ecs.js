import { defineComponent, defineQuery, pipe, Types } from 'bitecs'

export const Follower = defineComponent({
    cultIndex: Types.i8
})
export const Position = defineComponent({
    x: Types.f32,
    y: Types.f32,
})
export const Orientation = defineComponent({
    a: Types.f32
})
export const Tile = defineComponent({
    index: Types.i8,
})
export const Animation = defineComponent({
    index: Types.i32,
    tick: Types.i32
})
export const Move = defineComponent({

})

const moveQuery = defineQuery([Move])
export const moveSystem = world => {
    const ents = moveQuery(world)
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i]
        Position.x[eid] += 0.25
    }
    return world
}
const animationQuery = defineQuery([Position, Orientation, Animation])
export const animationSystem = world => {
    const { renderer } = world
    const ents = animationQuery(world)
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i]
        renderer.putAnimation(Animation.index[eid], Animation.tick[eid], Position.x[eid], Position.y[eid], Orientation.a[eid])
        Animation.tick[eid] += 1
    }
    return world
}
const displayQuery = defineQuery([Position, Orientation, Tile])
const displaySystem = world => {
    const { renderer } = world
    const ents = displayQuery(world)
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i]
        renderer.putTile(Tile.index[eid], Position.x[eid], Position.y[eid], Orientation.a[eid])
    }
    return world
}
export const pipeline = pipe(moveSystem, displaySystem, animationSystem)
