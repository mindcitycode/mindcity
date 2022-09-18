const FLIPPED_HORIZONTALLY_FLAG = 0x80000000
const FLIPPED_VERTICALLY_FLAG = 0x40000000
const FLIPPED_DIAGONALLY_FLAG = 0x20000000
const NOT_FLIPPED = ~(FLIPPED_HORIZONTALLY_FLAG
    | FLIPPED_VERTICALLY_FLAG
    | FLIPPED_DIAGONALLY_FLAG)

const codeToGid = i => (i & NOT_FLIPPED)
const codeHasVerticalFlip = i => (i & FLIPPED_VERTICALLY_FLAG) ? true : false
const codeHasHorizontalFlip = i => (i & FLIPPED_HORIZONTALLY_FLAG) ? true : false
const codeHasDiagonalFlip = i => (i & FLIPPED_DIAGONALLY_FLAG) ? true : false
/*
"tilesets":[
    {
     "columns":27,
     "firstgid":1,
     "image":"..\/imgs\/tilemap_packed.png",
     "imageheight":288,
     "imagewidth":432,
     "margin":0,
     "name":"tilemap_packed",
     "spacing":0,
     "tilecount":486,
     "tileheight":16,
     "tilewidth":16
    }],
*/
export const extractTileDefinitions = tilemap => {
    const tiles = []
    tilemap.tilesets.forEach(tileset => {
        for (let id = 0; id < tileset.tilecount; id++) {
            const gid = id + tileset.firstgid
            const i = id % tileset.columns
            const j = Math.floor(id / tileset.columns)
            tiles[gid] = {
                image: tileset.image,
                rectangle: [
                    i * tileset.tilewidth,
                    j * tileset.tileheight,
                    tileset.tilewidth,
                    tileset.tileheight
                ]
            }
        }
        // tile having properties
        tileset.tiles.forEach(({ id, properties }) => {
            const gid = id + tileset.firstgid
            const property = properties.find(p => p.name === 'vertical-sort-tile-offset')
            if (property) {
                tiles[gid].vsort = parseInt(property.value) * tileset.tileheight
            }
        })

        // tile having collision shape 
        tileset.tiles.forEach(({ id, objectgroup }) => {
            if (objectgroup !== undefined) {
                const gid = id + tileset.firstgid
                tiles[gid].collisionShapes = objectgroup
            }
        })
    })
    return tiles
}

export const urlfilename = path => path.replace(/.*\//, '')

// replace tileset image by closest provided image url
export const fixImagesPath = (tilemap, imagesUrls) => {
    tilemap.tilesets.forEach(tileset => {
        const path = tileset.image
        const name = urlfilename(path)
        const url = imagesUrls.find(url => urlfilename(url) === name)
        tileset.image = url
    })
}

export const getBounds = tilemap => {
    let x = Number.POSITIVE_INFINITY
    let y = Number.POSITIVE_INFINITY
    tilemap.layers.forEach(layer => {
        x = Math.min(x, layer.startx * tilemap.tilewidth)
        y = Math.min(y, layer.starty * tilemap.tileheight)
    })
    const width = tilemap.tilewidth * tilemap.width
    const height = tilemap.tileheight * tilemap.height
    return { x, y, width, height }

}
export const tilemapRenderer = (renderer, tilemap) => {

    const tiles = extractTileDefinitions(tilemap)

    const tileIdxByGid = []
    tiles.forEach((tile, gid) => {
        tileIdxByGid[gid] = renderer.makeTile(tile.image, ...tile.rectangle)
    })
    const bounds = getBounds(tilemap)

    const offx = -1 * bounds.x
    const offy = -1 * bounds.y

    function getTileOrigin(tilemap, layer, chunk, codeIdx, code) {
        if (code === 0)
            return

        const gid = codeToGid(code)
        const [tilewidth, tileheight] = tiles[gid].rectangle.slice(2)
        const i = layer.x + chunk.x + codeIdx % chunk.width
        const j = layer.y + chunk.y + Math.floor(codeIdx / chunk.width)
        const x = i * tilemap.tilewidth
        const y = j * tilemap.tileheight
        return { x, y }
        // offx, offy ?
    }

    function getCollisionShapes() {
        const allCollisionShapes = []
        tilemap.layers.map(layer => {
            if (!layer.visible) return
            layer.chunks.forEach((chunk, chunkIdx) => {
                chunk.data.forEach((code, codeIdx) => {
                    if (code === 0) return
                    const tileOrigin = getTileOrigin(tilemap, layer, chunk, codeIdx, code)
                    tiles[codeToGid(code)]?.collisionShapes?.objects.forEach(collisionObject => {
                        const collisionRectangle = {
                            x: collisionObject.x + tileOrigin.x,
                            y: collisionObject.y + tileOrigin.y,
                            width: collisionObject.width,
                            height: collisionObject.height,
                            source: { tilemap, layer, chunk, code, codeIdx, tileOrigin }
                        }
                        allCollisionShapes.push(collisionRectangle)
                    })
                })
            })
        })
        console.log(allCollisionShapes)
    }
    getCollisionShapes()

    return function render(origin) {
        tilemap.layers.map(layer => {
            if (!layer.visible) return
            layer.chunks.forEach((chunk, chunkIdx) => {
                chunk.data.forEach((code, codeIdx) => {

                    if (code === 0)
                        return

                    const gid = codeToGid(code)
                    let scaleX = codeHasHorizontalFlip(code) ? -1 : 1
                    let scaleY = codeHasVerticalFlip(code) ? -1 : 1
                    let angle = 0
                    if (codeHasDiagonalFlip(code)) {
                        angle = Math.PI / 2
                        scaleX *= -1
                    }
                    const vsort = tiles[gid].vsort
                    const [tilewidth, tileheight] = tiles[gid].rectangle.slice(2)
                    const i = chunk.x + codeIdx % chunk.width
                    const j = chunk.y + Math.floor(codeIdx / chunk.width)
                    const x = -1 * origin.x + layer.x + i * tilemap.tilewidth
                    const y = -1 * origin.y + layer.y + j * tilemap.tileheight
                    renderer.putTile(tileIdxByGid[gid],
                        offx + x + tilewidth / 2,
                        offy + y + tileheight / 2,
                        angle,
                        scaleX,
                        scaleY,
                        vsort
                    )
                })
            })
        })
    }

}
