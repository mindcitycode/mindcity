import { TinySprite } from "./sprite.js"
import { CreateTexture } from "./utils.js"
import { loadImage } from '../image.js'

function Tile(texture, frameX, frameY, frameW, frameH, center = true) {
    this.width = frameW;
    this.height = frameH;
    this.texture = texture;
    this.u0 = frameX / texture.width;
    this.v0 = frameY / texture.height;
    this.u1 = this.u0 + (frameW / texture.width);
    this.v1 = this.v0 + (frameH / texture.height);
    if (center) {
        this.halfWidth = frameW / 2;
        this.halfHeight = frameH / 2;
    } else {
        this.halfWidth = 0
        this.halfHeight = 0

    }
}
function Animation(tileIndexes, period) {
    this.tileIndexes = tileIndexes
    this.tileCount = tileIndexes.length
    this.period = period
}
export const Renderer = async (canvas, imagesUrls) => {

    // create gl sprite batch renderer
    var renderer = TinySprite(canvas)
    renderer.bkg(0, 0, 0)

    // load images
    const images = await Promise.all(imagesUrls.map(loadImage))
    const textures = images.map(image => CreateTexture(renderer.g, image, image.width, image.height))

    // tiles
    const tiles = []
    const getTextureFromImageUrl = imageUrl => textures[imagesUrls.indexOf(imageUrl)]
    const makeTile = (imageUrl, frameX, frameY, frameW, frameH) => {
        // create a tile, returns index
        tiles.push(
            new Tile(getTextureFromImageUrl(imageUrl), frameX, frameY, frameW, frameH)
        )
        return tiles.length - 1
    }

    // add a tile to rendering batch
    const putTile = (tileIndex, x, y, a, scalex = 1, scaley = 1) => {
        const tile = tiles[tileIndex]
        renderer.img(
            // Texture
            tile.texture,
            // Position X 
            -tile.halfWidth,
            // Position Y
            -tile.halfHeight,
            // Width
            tile.width,
            // Height
            tile.height,
            // Rotation
            a,
            // Translation X
            x,
            // Translation Y
            y,
            // Scale X
            scalex,
            // Scale Y
            scaley,
            // UV0
            tile.u0,
            tile.v0,
            // UV1
            tile.u1,
            tile.v1
        );
    }

    // animations
    const animations = []
    const makeAnimation = (tileIndexes, period) => {
        // create an animation, returns index
        animations.push(
            new Animation(tileIndexes, period)
        )
        return animations.length - 1
    }
    const putAnimation = (animationIndex, ticks, x, y, a) => {
        const { tileIndexes, tileCount, period } = animations[animationIndex]
        const frame = Math.floor(ticks / period) % tileCount
        const tileIndex = tileIndexes[frame]
        putTile(tileIndex, x, y, a)
    }

    return {
        ...renderer,
        makeTile,
        putTile,
        makeAnimation,
        putAnimation
    }

}
