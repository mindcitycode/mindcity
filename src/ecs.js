import { defineComponent, defineQuery, hasComponent, pipe, Types } from 'bitecs'

export const Follower = defineComponent({
    cultIndex: Types.i8
})
export const Position = defineComponent({
    x: Types.f32,
    y: Types.f32,
})
export const Velocity = defineComponent({
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
export const Commands = defineComponent({
    goLeft: Types.i8,
    goRight: Types.i8,
    goUp: Types.i8,
    goDown: Types.i8
})

const movementControlQuery = defineQuery([Velocity, Commands])
export const movementControlSystem = world => {
    const ents = movementControlQuery(world)
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i]
        const dx = Commands.goLeft[eid] ? -1 : Commands.goRight[eid] ? 1 : 0
        const dy = Commands.goUp[eid] ? -1 : Commands.goDown[eid] ? 1 : 0
        if (hasComponent(world, Velocity, eid)) {
            Velocity.x[eid] = 0.5 * dx
            Velocity.y[eid] = 0.5 * dy
        }
        if (hasComponent(world, Animation, eid)) {
            if (Commands.goLeft[eid]) {
                Animation.index[eid] = 0
            } else if (Commands.goDown[eid]) {
                Animation.index[eid] = 1
            } else if (Commands.goUp[eid]) {
                Animation.index[eid] = 2
            } else if (Commands.goRight[eid]) {
                Animation.index[eid] = 3
            }
        }
    }
    return world
}

const moveQuery = defineQuery([Velocity, Position])
export const moveSystem = world => {
    const ents = moveQuery(world)
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i]
        Position.x[eid] += Velocity.x[eid]
        Position.y[eid] += Velocity.y[eid]
    }
    return world
}
const animationQuery = defineQuery([Position, Orientation, Animation])
export const animationSystem = world => {
    const { renderer } = world
    const ents = animationQuery(world)
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i]
        renderer.putAnimation(
            Animation.index[eid], Animation.tick[eid],
            Math.round(Position.x[eid] - world.tilemapOrigin.x), 
            Math.round(Position.y[eid] - world.tilemapOrigin.y),
            Orientation.a[eid]
        )
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
        renderer.putTile(Tile.index[eid], Position.x[eid], Position.y[eid], Orientation.a[eid],1,1,0)
    }
    return world
}
export const pipeline = pipe(movementControlSystem, moveSystem, displaySystem, animationSystem)
