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
export const extractTiles = tilemap => {
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