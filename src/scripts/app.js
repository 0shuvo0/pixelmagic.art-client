import '../styles/global.scss'
import '../styles/app.scss'

const $ = (selector, parent = document) => parent.querySelector(selector)
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)]

const micWrapper = $(".mic-wrapper")
const micInfo = $(".mic-info", micWrapper)

// import Artyom from "artyom.js"
import SpeechRecognition from './utils/scpeech-recognition.js'

import './utils/img-upload.js'

import { getImageEdit, getUserCredits, getCreditPurchaseUrl } from './utils/bff.js'

import { auth, signIn } from './utils/firebase.js'

const mic_on_sound = new Audio('/audio/mic-on.wav')
const mic_error_sound = new Audio('/audio/mic-error.mp3')
const no_browser_support_sound = new Audio('/audio/mic-error.mp3')

const promptInput = $("#prompt-input")


const selectImgBtn = $("#select-image-btn")
const editingImg = $("#editing-img")

selectImgBtn.addEventListener('click', () => {
    const img = $("#user-selected-photo").src
    const file = $(".user-selected-photo-input").files[0]
    
    if(!img || !file) return alert("Please select an image to edit")


    editingImg.src = img
    $(".app-section-img-upload").remove()
    $(".app-section").classList.remove('d-none')
    // initApp()
    setTimeout(initApp, 500)
})

function initApp(){
    const speechRecognition = new SpeechRecognition()

    try{
        if(!speechRecognition.isSupported()){
            no_browser_support_sound.play()
            micWrapper.remove()
            speechRecognition.destroy()
            return
        }
    
        speechRecognition.start({
            onStart: () => {
                    micWrapper.classList.remove('disabled')
                    micInfo.innerText = 'Listening ...'
                    mic_on_sound.play()
            },
            onResult: res => {
                promptInput.value = res
            },
            onStop: (final) => {
                speechRecognition.pause()
                if(final.split(' ').length < 2){
                    setTimeout(() => {
                        prompt.innerText = ''
                        speechRecognition.resume()
                    }, 300)
                    return
                }
    
                !micWrapper.classList.contains('disabled') && micWrapper.classList.add('disabled')
                micInfo.innerText = 'muted'
                
                generateEdit(final).finally(() => {
                    promptInput.innerText = ''
                    speechRecognition.resume()
                })
            }
        })
    }catch(err){
        micWrapper.remove()
        speechRecognition.destroy()
        mic_error_sound.play()
    }

}

const loadingModal = $("#page-loading-modal")

async function generateEdit(prompt){
    loadingModal.classList.remove("d-none")

    const img = editingImg.src
    await getImageEdit(img, prompt)

    loadingModal.classList.add("d-none")
}

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




let selectedPackage = 'basic'
const creditPacks = $$(".credit-packs-container .credit-pack")
const buyNowBtn = $("#buy-credit-btn")


creditPacks.forEach(pack => {
    pack.addEventListener('click', () => {
        creditPacks.forEach(pack => pack.classList.remove('active'))
        pack.classList.add('active')
        selectedPackage = pack.getAttribute('data-name')
    })
})

buyNowBtn.addEventListener('click', async () => {
    buyNowBtn.innerHTML = 'Processing ...'
    buyNowBtn.classList.add('disabled')

    try{
        const url = await getCreditPurchaseUrl(selectedPackage)
        window.location.href = url
    }catch(err){
        alert('Something went wrong')
        console.log(err)
    }

    buyNowBtn.innerHTML = 'Processing ...'
    buyNowBtn.classList.remove('disabled')
})