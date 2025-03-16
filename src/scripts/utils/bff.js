const BASE_URL = 'http://localhost:3000'

import { auth } from "./firebase"

async function getImageEdit(img, prompt){
    return new Promise((resolve, reject) => {
        console.log(img, prompt)
        setTimeout(resolve, 1500)
    })
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
