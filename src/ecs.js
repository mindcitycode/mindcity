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
const animationQuery = defineQuery([Animation])
const animationSystem = world => {
    const { renderer } = world
    renderer.cls();
    const ents = displayQuery(world)
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i]
        renderer.putAnimation(Animation.index[eid], Animation.tick[eid], Position.x[eid], Position.y[eid], Orientation.a[eid])
        Animation.tick[eid] += 1
    }
    renderer.flush()

}
const displayQuery = defineQuery([Position, Orientation, Tile])
const displaySystem = world => {
    const { renderer } = world
    renderer.cls();
    const ents = displayQuery(world)
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i]
        renderer.putTile(Tile.index[eid], Position.x[eid], Position.y[eid], Orientation.a[eid])
    }
    renderer.flush()
}

//export const pipeline = pipe(displaySystem)
export const pipeline = pipe(animationSystem)
