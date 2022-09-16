//const fs = require('fs')
/*
const data = {
    "meta": {
        "image": "/assets/imgs/tilemap_packed.png",
        "tilewidth": 16,
        "tileheight": 16
    }
}
*/

export const kinds = ['green', 'red', 'violet', 'helmet', 'blond', 'black']
export const directions = ['left', 'down', 'up', 'right']
export const steps = ['idle', 'walk1', 'walk2']

const tilewidth = 16
const tileheight = 16
const top = 0
const left = tilewidth * 23;

export const animationTiles = kinds.flatMap((kind, kindIdx) =>
    directions.flatMap((direction, directionIdx) =>
        steps.flatMap((step, stepIdx) => ({
            kind, direction, step,
            //name: `${kind}-${direction}-${step}`,
            rect: {
                x: left + tilewidth * directionIdx,
                width: tilewidth,
                y: top + tileheight * (kindIdx * 3 + stepIdx),
                height: tileheight
            }
        })
        )
    )
)

export const metaAnimations = [
    ['idle', 10, ['idle']],
    ['walk', 10, ['walk1', 'idle', 'walk2', 'idle']],
]

export const animations = kinds.flatMap((kind, kindIdx) =>
    directions.flatMap((direction, directionIdx) =>
        metaAnimations.flatMap(([movement, period, steps], metaAnimationIdx) => {
            const tiles = steps.flatMap((step, stepId) => animationTiles.filter(
                at => (at.kind === kind) && (at.direction === direction) && (at.step === step)
            ))
            return {
                kind, direction, movement, period, rects: tiles.map(tile => tile.rect),// tiles
            }
        })
    )
)

