const fetch = require('node-fetch');

async function random() {
    let countProm = await fetch('https://dfoto.se/v1/gallery/count')
    let count = await countProm.json()
    let galleryProm = await fetch(`https://dfoto.se/v1/gallery/limit/${count.count}`)
    let galleries = await galleryProm.json()
    let allImagesProm = await fetch(`https://dfoto.se/v1/image/${Array.from(galleries)[Math.floor(Math.random() * count.count)]._id}`)
    let allImages = Array.from(await allImagesProm.json())
    return `https://dfoto.se/v1/image/${allImages[Math.floor(Math.random() * allImages.length)]._id}/preview`
}

exports.random = random;