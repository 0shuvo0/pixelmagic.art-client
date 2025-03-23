import '../styles/global.scss'
import '../styles/app.scss'

const $ = (selector, parent = document) => parent.querySelector(selector)
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)]


let selectedPackage = 'pro'
const creditPacks = $$(".credit-packs-container .credit-pack")
const buyNowBtn = $("#buy-credit-btn")

creditPacks.forEach(pack => {
    pack.addEventListener('click', () => {
        creditPacks.forEach(pack => pack.classList.remove('active'))
        pack.classList.add('active')
        selectedPackage = pack.getAttribute('data-name')
    })
})


buyNowBtn.addEventListener('click', () => {
    window.location.href = '/app.html?buy-now=' + selectedPackage
})