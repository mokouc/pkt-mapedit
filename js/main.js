
var uw = 20 / 2
var uh = 10 / 2

$(document).ready(function() {
    
    document.onkeydown = function(e) {
        switch(e.key) {
            case 'a': $('.aim').addClass('setFloor'); break
            case 'd': $('.aim').addClass('delete'); break
            case 's': $('.aim > img').addClass('mirro'); break
        }
    }
    
    document.onkeyup = function(e) {
        switch(e.key) {
            case 'a': $('.aim').removeClass('setFloor'); break
            case 'd': $('.aim').removeClass('delete'); break
            case 's': $('.aim > img').removeClass('mirro'); break
        }
    }
    
    document.addEventListener('click', function(e) {
        if($('.aim').is('.delete')) { 
            e.stopPropagation()
            if($(e.target).is('.item')) {
                $(e.target).remove()
            }
            if($(e.target).is('.icon')) {
                $(e.target).remove()
                if($('.aim > img').attr('title') == e.target.title) {
                    $('.aim > img').replaceWith($('<img>'))
                }
            }
        }
        if($('.aim').is('.setFloor')) {
            e.stopPropagation()
            $(e.target).toggleClass('floor')
        }
    }, true)

    $('.map-container').mouseout(function(e) {
        $('.aim').css({visibility: 'hidden'})
    })

    $('.map-container').mouseover(function(e) {
        $('.aim').css({visibility: 'visible'})
    })

    $('.map-container').mousemove(function(e) {
        $('.aim').css(calcLocate(e))
    })

    $('.map-container').click(function(e) {
        if(!$('.aim > img').is('.item')) {
            return
        }
        var img = $('.icon.selected').clone().removeClass('icon').addClass($('.aim > img').attr('class')).css(calcLocate(e)).appendTo($('.map'))
        var x = parseInt((img.position().left + img.width() / 2) / uw)
        var y = parseInt((img.position().top + img.height() - img.width() / 4) / uh)
        img.css('z-index', img.is('.floor') ? '0' : (y - x + 150) * 10 + y)
    })

    $('.tool-container').click(function(e) {
        if($(e.target).is('.icon')) {
            if($(e.target).is('.selected')) {
                $('.aim > img').replaceWith($('<img>'))
            } else {
                $('.aim > img').replaceWith($(e.target).clone().removeClass('icon').addClass('item'))
                $('.icon.selected').removeClass('selected')
            }
            $(e.target).toggleClass('selected')
            return
        }
        $('.upload').click()
    })

    $('.item').click(function() {
        console.log('haha')
    })

    $('.upload').change(function(e) {
        $(this.files).each(function() {
            var img = $(`<img class="icon" title="${this.name.match(/(\S*)\./)[1]}">`).appendTo($('.tool-container'))
            var reader = new FileReader()
            reader.readAsDataURL(this)
            reader.addEventListener('load', function() {
                img.attr({src: reader.result})
            })
        })
        this.value = ''
    })
})

function calcLocate(e) {
    // var tmp = parseInt((e.pageX % uw + e.pageY % uh * 2) / 20) * 0
    return {
        left: parseInt((e.pageX - $('.map').offset().left) / uw) * uw - ($('.aim > img').width() - uw / 2) / 2,
        top: parseInt((e.pageY - $('.map').offset().top) / uh) * uh - ($('.aim > img').height() - uh / 2) / 2,
    }
}