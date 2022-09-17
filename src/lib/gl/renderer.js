import { TinySprite } from "./sprite.js"
import { CreateTexture } from "./utils.js"
import { loadImage } from '../image.js'

function Tile(texture, frameX, frameY, frameW, frameH) {
    this.width = frameW;
    this.height = frameH;
    this.texture = texture;
    this.u0 = frameX / texture.width;
    this.v0 = frameY / texture.height;
    this.u1 = this.u0 + (frameW / texture.width);
    this.v1 = this.v0 + (frameH / texture.height);
    this.halfWidth = frameW / 2;
}

export const Renderer = async (canvas, imagesUrls) => {

    // create gl sprite batch renderer
    var renderer = TinySprite(canvas)
    renderer.bkg(0, 0, 0)

    // load images
    const images = await Promise.all(imagesUrls.map(loadImage))
    const textures = images.map(image => CreateTexture(renderer.g, image, image.width, image.height))

    const tiles = []
    const getTextureFromImageUrl = imageUrl => textures[imagesUrls.indexOf(imageUrl)]
    
    // create a tile, return index
    const makeTile = (imageUrl, frameX, frameY, frameW, frameH) => {
        tiles.push(
            new Tile(getTextureFromImageUrl(imageUrl), frameX, frameY, frameW, frameH)
        )
        return tiles.length - 1
    }

    // add a tile to rendering batcg
    const putTile = (tileIndex, x, y, a) => {
        const tile = tiles[tileIndex]
        renderer.img(
            // Texture
            tile.texture,
            // Position X 
            -tile.halfWidth,
            // Position Y
            0,
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
            1,
            // Scale Y
            1,
            // UV0
            tile.u0,
            tile.v0,
            // UV1
            tile.u1,
            tile.v1
        );
    }

    return {
        ...renderer,
        putTile,
        makeTile,
    }

}
