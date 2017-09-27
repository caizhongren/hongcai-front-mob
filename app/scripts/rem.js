window.onload = function(){
    function setRem() {
        (document.documentElement.style.fontSize = (document.documentElement.clientWidth > 640 ? 100 : 100 * document.documentElement.clientWidth / 640) + "px")
        window.addEventListener && (document.addEventListener("DOMContentLoaded",
            function() {
                setRem()
            }), window.addEventListener("load",
            function() {
                setTimeout(setRem, 300)
            }), window.addEventListener("resize",
            function() {
                setTimeout(setRem, 300)
            }))
    }
    setRem();
}()