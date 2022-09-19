import { defineComponent, defineQuery, hasComponent, pipe, Types } from 'bitecs'

export const CULT_GREEN = 0
export const CULT_RED = 1
export const CULT_VIOLET = 2
export const CULT_HELMET = 3
export const CULT_BLOND = 4
export const CULT_BLACK = 5
export const CULT_COUNT = 6
export const CultFollower = defineComponent({
    index: Types.i8
})
export const Position = defineComponent({
    x: Types.f32,
    y: Types.f32,
})
export const Velocity = defineComponent({
    x: Types.f32,
    y: Types.f32,
})

export const ORIENTATION_LEFT = 0
export const ORIENTATION_DOWN = 1
export const ORIENTATION_UP = 2
export const ORIENTATION_RIGHT = 3
export const Orientation = defineComponent({
    // left down up right
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
export const FootCollider = defineComponent({
    // from center
    minX: Types.f32,
    maxX: Types.f32,
    minY: Types.f32,
    maxY: Types.f32,
})

const movementControlQuery = defineQuery([Velocity, Commands])
export const movementControlSystem = world => {
    const ents = movementControlQuery(world)
    for (let i = 0; i < ents.length; i++) {
        const eid = ents[i]

        let noMoveCommand = false
        if (hasComponent(world, Orientation, eid)) {
            if (Commands.goLeft[eid]) {
                Orientation.a[eid] = ORIENTATION_LEFT
            } else if (Commands.goDown[eid]) {
                Orientation.a[eid] = ORIENTATION_DOWN
            } else if (Commands.goUp[eid]) {
                Orientation.a[eid] = ORIENTATION_UP
            } else if (Commands.goRight[eid]) {
                Orientation.a[eid] = ORIENTATION_RIGHT
            } else {
                noMoveCommand = true
            }
        }
        if (hasComponent(world, Velocity, eid)) {
            const dx = Commands.goLeft[eid] ? -1 : Commands.goRight[eid] ? 1 : 0
            const dy = Commands.goUp[eid] ? -1 : Commands.goDown[eid] ? 1 : 0
            Velocity.x[eid] = 0.5 * dx
            Velocity.y[eid] = 0.5 * dy
        }
        if (hasComponent(world, Animation, eid)) {
            const a = Orientation.a[eid]
            const cult = hasComponent(world,CultFollower,eid) ? (CultFollower.index[eid] ) : (0)
            const cultOffset = 8 * cult  //hasComponent(world,CultFollower,eid) ? (CultFollower.index[eid] * 5) : (0)
            if (noMoveCommand) {
                switch (a) {
                    case ORIENTATION_LEFT: Animation.index[eid] = cultOffset + 1; break;
                    case ORIENTATION_DOWN: Animation.index[eid] = cultOffset + 3; break;
                    case ORIENTATION_UP: Animation.index[eid] = cultOffset + 5; break;
                    case ORIENTATION_RIGHT: Animation.index[eid] = cultOffset + 7; break;
                }
            } else {
                switch (a) {
                    case ORIENTATION_LEFT: Animation.index[eid] = cultOffset + 0; break;
                    case ORIENTATION_DOWN: Animation.index[eid] = cultOffset + 2; break;
                    case ORIENTATION_UP: Animation.index[eid] = cultOffset + 4; break;
                    case ORIENTATION_RIGHT: Animation.index[eid] = cultOffset + 6; break;
                }
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

        const destx = Position.x[eid] + Velocity.x[eid]
        const desty = Position.y[eid] + Velocity.y[eid]
        if (hasComponent(world, FootCollider, eid)) {

            for (let tryIdx = 0; tryIdx < 3; tryIdx++) {
                const pdestx = ((tryIdx === 0) || (tryIdx === 1)) ? (destx) : (Position.x[eid])
                const pdesty = ((tryIdx === 0) || (tryIdx === 2)) ? (desty) : (Position.y[eid])
                const collides = world.staticTilemapCollider.collides({
                    //            const result = world.staticTilemapCollider.search({
                    minX: pdestx + FootCollider.minX[eid],
                    maxX: pdestx + FootCollider.maxX[eid],
                    minY: pdesty + FootCollider.minY[eid],
                    maxY: pdesty + FootCollider.maxY[eid]
                })
                if (!collides) {
                    Position.x[eid] = pdestx
                    Position.y[eid] = pdesty
                    break;
                }
            }
        } else {
            Position.x[eid] = destx
            Position.y[eid] = desty
        }

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
            0//Orientation.a[eid]
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
        renderer.putTile(Tile.index[eid], Position.x[eid], Position.y[eid], Orientation.a[eid], 1, 1, 0)
    }
    return world
}
export const pipeline = pipe(movementControlSystem, moveSystem, displaySystem, animationSystem)
