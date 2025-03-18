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

import { downloadBase64Image } from './utils/utils.js'

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
    editingImg.setAttribute('data-imgname', file.name)
    $(".app-section-img-upload").remove()
    $(".app-section").classList.remove('d-none')
    // initApp()
    setTimeout(initSpeechRecognition, 500)
})

function initSpeechRecognition(){
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
        const newimg = await getImageEdit(img, prompt ,editingImg.getAttribute('data-imgname'))
        if(newimg){
            addToHistory('data:image/png;base64,' + newimg)
            editingImg.src = 'data:image/png;base64,' + newimg
            editingImg.setAttribute('data-imgname', 'picmagic.png')
            $('.count', userInfoContainer).innerText = currentCredit - 1
        }else{
            alert("Something went wrong")
        }
    
    }catch(err){
        alert(err.message || "Error getting edit")
        console.log(err)
    }
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
    buyNowBtn.innerHTML = 'Processing ...'
    buyNowBtn.classList.add('disabled')

    try{
        const url = await getCreditPurchaseUrl(selectedPackage)
        if(url){
            window.location.href = url
        }else{
            alert('Something went wrong')
        }
    }catch(err){
        alert('Something went wrong')
        console.log(err)
    }

    buyNowBtn.innerHTML = `<span>Buy Now</span>
            <svg fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 330 330" xml:space="preserve">
              <path id="XMLID_27_" d="M15,180h263.787l-49.394,49.394c-5.858,5.857-5.858,15.355,0,21.213C232.322,253.535,236.161,255,240,255
                s7.678-1.465,10.606-4.394l75-75c5.858-5.857,5.858-15.355,0-21.213l-75-75c-5.857-5.857-15.355-5.857-21.213,0
                c-5.858,5.857-5.858,15.355,0,21.213L278.787,150H15c-8.284,0-15,6.716-15,15S6.716,180,15,180z" fill="#fff" />
            </svg>`
    buyNowBtn.classList.remove('disabled')
})