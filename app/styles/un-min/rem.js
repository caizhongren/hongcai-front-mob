window.onload = function(){
    function setRem() {
      if(window.orientation!=0){
        alert('亲，把手机竖起来游戏体验更好哦～')
      }
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
  function setHeight () {
    document.body.style.height = window.innerHeight + 'px'
  }
  window.addEventListener('load', function () {
    setHeight()
  })
  window.addEventListener('resize', function () {
    setHeight()
  })
}()
