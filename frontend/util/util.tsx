const imageSize = async (url: string): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
            const size = {
                width: img.naturalWidth,
                height: img.naturalHeight,
            }

            resolve(size)
        }

        img.onerror = (error) => {
            reject(error)
        }

        img.src = url
    })
}

const convertYoutubeLink = (link: string): string => {
    const youtubeId = link.split("/").slice(-1)[0]
    return `https://www.youtube.com/embed/${youtubeId}`
}

export {
    imageSize,
    convertYoutubeLink
}