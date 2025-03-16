if(!window.$){
    window.$ = (selector, parent = document) => parent.querySelector(selector)
    window.$$ = (selector, parent = document) => [...parent.querySelectorAll(selector)]
}


//Components/Image upload
const imgUploaders = $$('.img-upload')
imgUploaders.forEach(createImgUploader)

function createImgUploader(imgUploader){
    const label = $('.img-drop-zone', imgUploader)
    const fileInput = $('input[type="file"]', label)
    const fileType = imgUploader.dataset.type

    const previewZone = $('.img-drop-preview', imgUploader)
    const previewImg = $('img', previewZone)
    
    const changeImgBtn = $('.change-btn', previewZone)
    changeImgBtn.addEventListener('click', () => {
        label.classList.remove('d-none')
        previewZone.classList.add('d-none')
        label.click()
        previewImg.src = ''
        fileInput.value = ''
    })

    //handle img drop on label
    label.addEventListener('dragover', (e) => {
        e.preventDefault()
    })
    label.addEventListener('dragleave', (e) => {
        e.preventDefault()
    })

    const showImg = dataURL => {
        label.classList.add('d-none')
        previewZone.classList.remove('d-none')
        previewImg.src = dataURL
    }


    label.addEventListener('drop', (e) => {
        e.preventDefault()
        label.classList.remove('active')
        const file = e.dataTransfer.files[0]
        if(!file){
            previewImg.src = ''
            return
        }
       
        

        //add dropped file to input
        fileInput.files = e.dataTransfer.files
        fileInput.dispatchEvent(new Event('change'))
        // handleImg(file)
        //     .then(dataurl => {

        //     })
        //     .catch(err => {
        //         alert(err)
        //     })
    })

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0]
        if(!file){
            previewImg.src = ''
            return
        }
        handleImg(file)
            .then(showImg)
            .catch(err => {
                alert(err)
            })
    })
}

function handleImg(file, maxSize = { maxWidth: 800, maxHeight: 800 }){
    
    return new Promise((resolve, reject) => {
        const minFileSize = 2 * 1024 //2kb
        const maxFileSize = 5 * 1024 * 1024 //5mb

        if(file.type.indexOf('image') === -1) return reject('Please upload an image')
        if(file.size < minFileSize) return reject('Please upload an image larger than 2kb')
        if(file.size > maxFileSize) return reject('Please upload an image less than 5mb')

        const img = new Image()
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            img.src = e.target.result
        }
        img.onload = () => {
            const MAX_WIDTH = maxSize.maxWidth
            const MAX_HEIGHT = maxSize.maxHeight
    
            let width = img.width
            let height = img.height
    
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height = height * (MAX_WIDTH / width)
                    width = MAX_WIDTH
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width = width * (MAX_HEIGHT / height)
                    height = MAX_HEIGHT
                }
            }
    
            const canvas = document.createElement("canvas")
            canvas.width = width
            canvas.height = height
            
            const ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0, width, height)
    
            const dataurl = canvas.toDataURL(file.type)
            // this.img = dataurl
            
            return resolve(dataurl)
        }
    })

}