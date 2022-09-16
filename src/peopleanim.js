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
const left = tilewidth * 23

export const animationTiles = kinds.flatMap((kind, kindIdx) =>
    directions.flatMap((direction, directionIdx) =>
        steps.map((step, stepIdx) = ({
            kind, direction, step, rect: {
                x: left + tilewidth * directionIdx,
                width: tilewidth,
                y: top + tileheight * (kindIdx * 3 + stepIdx),
                height: tileheight
            }
        })
        )
    )
)