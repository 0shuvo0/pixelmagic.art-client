const BASE_URL = 'http://localhost:3000'

import { auth } from "./firebase"
import { base64ToFile } from './utils.js'

async function getImageEdit(img, prompt, fileName = 'img.png'){
    const user = auth.currentUser
    if(!user) throw new Error('Login to continue')

    const token = await user.getIdToken()
    if(!token) throw new Error('Login to continue')

    const fromData = new FormData()

    fromData.append('prompt', prompt)

    console.log(34)
    const file = await base64ToFile(img, fileName)
    fromData.append('photo', file, fileName)
    console.log(file)

    const res = await fetch(BASE_URL + '/get-edit', {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: fromData
    })

    const { success, content, message } = await res.json()

    if(!success) throw new Error(message || "Somthing went wrong")

    return content
}

async function getUserCredits() {
    try{
        const user = auth.currentUser
        if(!user) return 0

        const token = await user.getIdToken()
        if(!token) return 0

        const res = await fetch(BASE_URL + '/get-credits', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const { success, message, content } = await res.json()

        if(!success){
            alert(message || "Something went wrong")
            return 0
        }

        return parseInt(content)
    }catch(err){
        console.log(err)
        alert("Something went wrong")
    }
}

async function getCreditPurchaseUrl(pack) {
    const user = auth.currentUser
        if(!user) return '?'

        const token = await user.getIdToken()
        if(!token) return '?'

        const res = await fetch(BASE_URL + '/get-purchase-url?pack=' + pack, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const { success, message, content } = await res.json()

        if(!success){
            throw new Error(message || "Something went wrong")
        }

        return content
}

export {
    getImageEdit,
    getUserCredits,
    getCreditPurchaseUrl
}
