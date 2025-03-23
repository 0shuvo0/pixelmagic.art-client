import '../styles/global.scss'
import '../styles/app.scss'

const $ = (selector, parent = document) => parent.querySelector(selector)
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)]

const micWrapper = $(".mic-wrapper")
const micInfo = $(".mic-info", micWrapper)

// import Artyom from "artyom.js"
import SpeechRecognition from './utils/scpeech-recognition.js'

import './utils/img-upload.js'

import { getImageEdit, getUserCredits, getSRToken} from './utils/bff.js'

import { downloadBase64Image } from './utils/utils.js'

import { auth, signIn } from './utils/firebase.js'

import { initializePaddle }  from '@paddle/paddle-js'

initializePaddle({
    token: 'test_c7c07ea3a5a90a2c2962dc2532d',
    environment: 'sandbox',
    eventCallback: e => {
        if(e.name !== 'checkout.completed') return
        const add_credit = parseInt(e.data.items[0].product.name.split(" ")[0])

        let prev_credit = 0
        try{
            prev_credit = parseInt($('.credit-box .count').innerText)
        }catch(e){
            prev_credit = 0
        }

        $('.credit-box .count').innerText = prev_credit + add_credit
    }
}).then(p => {
    window.paddle = p

    setTimeout(() => {
        if(!auth.currentUser) return
    
        const urlParams = new URLSearchParams(window.location.search)
        const buyNow = urlParams.get('buy-now')?.trim()
        console.log(buyNow)
        if(buyNow){
            openPaddleCheckout(buyNow)
    
            //remove buy-now query param without reloading page
            urlParams.delete('buy-now'); // Remove the parameter
            const newUrl = window.location.pathname + '?' + urlParams.toString();
            window.history.replaceState({}, '', newUrl.endsWith('?') ? newUrl.slice(0, -1) : newUrl);
        }
    }, 500)
})

const mic_on_sound = new Audio('/audio/mic-on.wav')
const mic_error_sound = new Audio('/audio/mic-error.mp3')
const no_browser_support_sound = new Audio('/audio/mic-error.mp3')

const promptInput = $("#prompt-input")


const selectImgBtn = $("#select-image-btn")
const editingImg = $("#editing-img")

const loadingModal = $("#page-loading-modal")

selectImgBtn.addEventListener('click', () => {
    const img = $("#user-selected-photo").src
    const file = $(".user-selected-photo-input").files[0]
    
    if(!img || !file) return alert("Please select an image to edit")
    

    loadingModal.classList.remove('d-none')

    editingImg.src = img
    editingImg.setAttribute('data-imgname', file.name)
    $(".app-section-img-upload").remove()
    $(".app-section").classList.remove('d-none')
    // initApp()
    setTimeout(initApp, 500)
})

async function initApp(){
    const speechRecognition = new SpeechRecognition()

    try{
        if(!navigator.mediaDevices){
            no_browser_support_sound.play()
            micWrapper.remove()
            speechRecognition.destroy()
            !loadingModal.classList.contains('d-none') && loadingModal.classList.add('d-none');
            return
        }

        const token = await getSRToken()

        !loadingModal.classList.contains('d-none') && loadingModal.classList.add('d-none');

        initSpeechRecognition(token)
    
        // speechRecognition.start({
        //     onStart: () => {
        //             micWrapper.classList.remove('disabled')
        //             micInfo.innerText = 'Listening ...'
        //             mic_on_sound.play()
        //     },
        //     onResult: res => {
        //         promptInput.value = res
        //     },
        //     onStop: (final) => {
        //         speechRecognition.pause()
        //         if(final.split(' ').length < 2){
        //             setTimeout(() => {
        //                 prompt.innerText = ''
        //                 speechRecognition.resume()
        //             }, 300)
        //             return
        //         }
    
        //         !micWrapper.classList.contains('disabled') && micWrapper.classList.add('disabled')
        //         micInfo.innerText = 'muted'
                
        //         generateEdit(final).finally(() => {
        //             promptInput.innerText = ''
        //             speechRecognition.resume()
        //         })
        //     }
        // })
    }catch(err){
        micWrapper.remove()
        mic_error_sound.play()
        console.log(err)
    }
}

function initSpeechRecognition(token){
    const recognition = new SpeechRecognition()
    recognition.init(token, {
        onInit: () => {
            micWrapper.classList.remove('disabled')
            micInfo.innerText = 'Listening ...'
            mic_on_sound.play()
        },
        onTranscript: e => promptInput.value = e,
        onCompleteSentence: e => {
            !micWrapper.classList.contains ('disabled') && micWrapper.classList.add('disabled')
            micInfo.innerText = '...'
            recognition.stop()

            generateEdit(e)
        },
        onClose: e => closeSR(e),
        onError: e => closeSR(e)
    })

    function closeSR(err){
        recognition.stop()
        micWrapper.remove()
        mic_error_sound.play()
    }
}


async function generateEdit(prompt){
    if(!prompt){
        alert("No edit asked")
        return
    }

    const currentCredit = parseInt($('.count', userInfoContainer).innerText)
    if(!currentCredit || currentCredit <= 0){
        !(buyCreditsModal.classList.contains('d-none')) && buyCreditsModal.classList.remove('d-none');
        return
    }
    
    loadingModal.classList.remove("d-none")
    try{
    
        const img = editingImg.src
        if(!img){
            alert("No Image Found")
            return
        }
        const {newimg, newToken} = await getImageEdit(img, prompt, editingImg.getAttribute('data-imgname'))
        
        if(!newimg){
            return alert("Something went wrong")
        }

        addToHistory('data:image/png;base64,' + newimg)
        editingImg.src = 'data:image/png;base64,' + newimg
        editingImg.setAttribute('data-imgname', 'picmagic.png')
        $('.count', userInfoContainer).innerText = currentCredit - 1
        
        if(newToken && navigator.mediaDevices){
            micInfo.innerText = 'Loading ...'
            initSpeechRecognition(newToken)
        }
    }catch(err){
        alert(err.message || "Error getting edit")
        console.log(err)
    }
    promptInput.value = ''
    loadingModal.classList.add("d-none")
}

const promptSendBtn = $(".prompt-input .send-icon")

async function handlePromptSubmit(){
    const p = promptInput.value.trim()
    if(!p) return
    await generateEdit(p)
    promptInput.value = ''
}
promptSendBtn.addEventListener('click',handlePromptSubmit)
promptInput.addEventListener('keypress', e => {
    if (e.key === 'Enter' || e.keyCode === 13){
        handlePromptSubmit()
    }
})


const editHistoryContainer = $(".edit-history-grid")
const mainImgDownloadBtn = $("#main-img-download-btn")

function addToHistory(img){
    const div = document.createElement('div')
    div.classList.add('downloadable-img')
    div.innerHTML = `<img src="${img}" alt="">`
    
    const overlay = document.createElement('div')
    overlay.classList.add('overlay')
    overlay.innerHTML = `
        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" fill="#fff"/>
            <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#fff"/>
        </svg>
        <span class="text">Download</span>
    `

    overlay.addEventListener('click', () => {
        downloadBase64Image(img)
    })

    div.appendChild(overlay)
    editHistoryContainer.prepend(div)
}


mainImgDownloadBtn.addEventListener('click', () => {
    downloadBase64Image(editingImg.src)
})






$$('.modal-wrapper').forEach(m => {
    const closeBtns = $$(".modal-close-btn", m)
    closeBtns.forEach(c => {
        c.addEventListener('click', () => {
            m.classList.add('d-none')
        })
    })
})


const loginModal = $("#login-modal")
const loginBtn = $('.login-btn')
const userInfoContainer = $(".user-info")

const buyCreditsModal = $("#buy-credits-modal")
const buyCreditsBtn = $('.buy-credits-btn')
buyCreditsBtn.addEventListener('click', () => {
    buyCreditsModal.classList.remove('d-none')
})

auth.onAuthStateChanged(async user => {
    if(!user){
        loginModal.classList.remove('d-none')
        !userInfoContainer.classList.contains('d-none') && userInfoContainer.classList.add('d-none');
        return
    }

    !loginModal.classList.contains('d-none') && loginModal.classList.add('d-none');
    userInfoContainer.classList.remove('d-none')

    const creditCount = await getUserCredits()
    if(!creditCount) buyCreditsModal.classList.remove('d-none')
    $('.count', userInfoContainer).innerText = creditCount
})

loginBtn.addEventListener('click', async () => {
    loginBtn.classList.add('disabled')
    await signIn()
    loginBtn.classList.add('remove')
})

const logoutBtn = $(".logout-btn")
logoutBtn.addEventListener('click', async () => {
    await auth.signOut()
    window.location.href = '/index..html'
})


let selectedPackage = 'pro'
const creditPacks = $$(".credit-packs-container .credit-pack")
const buyNowBtn = $("#buy-credit-btn")

const packSelectSounds = {
    trial: new Audio('/audio/pack_select_trial.mp3'),
    standard: new Audio('/audio/pack_select_standard.mp3'),
    pro: new Audio('/audio/pack_select_pro.mp3')
}

creditPacks.forEach(pack => {
    pack.addEventListener('click', () => {
        creditPacks.forEach(pack => pack.classList.remove('active'))
        pack.classList.add('active')
        selectedPackage = pack.getAttribute('data-name')
        packSelectSounds[selectedPackage].play()
    })
})


buyNowBtn.addEventListener('click', async () => {
    
    openPaddleCheckout(selectedPackage)
    
    buyCreditsModal.classList.add("d-none")
})

const packs = {
    trial: {
        name: 'trial',
        price: 1.99,
        credit: 10,
        productId: 'pro_01jpsnj5ewkgw1avs1q5rtnwwj',
        priceId: 'pri_01jpsnmw6ygkg5vv4w2s0j1rnr',

    },
    standard: {
        name: 'Standard',
        price: 4.99,
        credit: 30,
        productId: 'pro_01jpsnp26ns8bbc418a2a5yxjq',
        priceId: 'pri_01jpsnpyw1ty4b8n6fq49xhtzd',
    },
    pro: {
        name: 'pro',
        price: 9.99,
        credit: 150,
        productId: 'pro_01jpsnr6n7y77sjtsz6dnmvg43',
        priceId: 'pri_01jpsntqk5v0wgf2xptej9r2ps',
    }
}

function openPaddleCheckout(selectedPackage){
    if(!auth.currentUser || !window.paddle) return

    window.c = window.paddle.Checkout.open({
        settings: {
          displayMode: "overlay",
          theme: "light",
          locale: "en",
        },
        customer: { email: auth.currentUser.email},
        customData: {
            email: auth.currentUser.email
        },
        items: [
            {
                priceId: packs[selectedPackage].priceId,
                quantity: 1
            }
        ]
    })
    
}