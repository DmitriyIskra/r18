export default function buttonToTop(el) {
    el.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    })
}