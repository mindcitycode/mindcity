export function fsCanvas(){
// dom
const $style = document.createElement('style')

// the  "width : min(100vw,200vh);" works because we know the canvas w/h ratio
$style.textContent = `
body { 
    background-color : black;
    margin:0;
    border:0;
    padding : 0;
}
canvas {
    background-color : grey;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    width : min(100vw,200vh);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);    
}
`
document.head.appendChild($style)
const $c = document.createElement('canvas')
document.body.appendChild($c)
return $c
}