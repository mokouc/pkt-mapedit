
var uw = 20
var uh = 10

$(document).ready(function() {

    document.onkeydown = function(e) {
        switch(e.key) {
            case 'p': $('.aim').height($('.aim').height() + 1); break
            case 'a': $('.aim').addClass('setFloor'); break
            case 'd': $('.aim').addClass('delete'); break
            case 's': $('.aim').addClass('mirro'); break
        }
    }
    
    document.onkeyup = function(e) {
        switch(e.key) {
            case 'a': $('.aim').removeClass('setFloor'); break
            case 'd': $('.aim').removeClass('delete'); break
            case 's': $('.aim').removeClass('mirro'); break
        }
    }
    
    document.addEventListener('click', function(e) {
        if($('.aim').is('.delete')) { 
            e.stopPropagation()
            if($(e.target).is('.item, .icon')) {
                $(e.target).remove()
                if($(e.target).is('.icon.selected')) {
                    $('.aim').replaceWith($('<img class="aim item" id="aim">'))
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
        drawImgOnMap($('.aim'), getLocation(e.pageX, e.pageY))
    })

    $('.map-container').click(function(e) {

        var positon = getLocation(e.pageX, e.pageY)
        var index = (positon.y + 150) * 50 + positon.x
        var item = $('.icon.selected').clone().addClass($('.aim').attr('class')).removeClass('icon aim').css('z-index', index)

        var l = 8
        var w = 4

        area(
            {x: positon.x - l / 2, y: positon.y - w / 2},
            {x: positon.x + l / 2, y: positon.y + w / 2}
        )
        drawImgOnMap(item, positon)
    })

    $('.tool-container').click(function(e) {
        if($(e.target).is('.icon')) {
            if($(e.target).is('.selected')) {
                $('.aim').attr('src', '')
            } else {
                $('.aim').attr('src', $(e.target).attr('src'))
                $('.icon.selected').removeClass('selected')
            }
            $(e.target).toggleClass('selected')
            return
        }
        $('.upload').click()
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

function getLocation(px, py) {
    var x = (px - $('.map').offset().left) / uw
    var y = (py - $('.map').offset().top) / uh
    return {
        x: Math.round(y + x),
        y: Math.round(y - x),
    }
}

function drawImgOnMap(item, positon) {
    $('.map').append(item.css({
        left: (positon.x - positon.y) * uw / 2 - (item[0].width / 2),
        // top: (positon.x + positon.y) * uh / 2 - (item[0].height / 2),
        top: (positon.x + positon.y) * uh / 2 - (item[0].height) + (item[0].width / 4),
        // top: (positon.x + positon.y) * uh / 2 - item[0].height + uh / 2,
    }))
}

function sout(data) {
    console.log(data)
    return data
}

function area(positon1, positon2){
    $('.item.debug').remove()
    for(let i = positon1.x; i < positon2.x; i++) {
        for(let j = positon1.y; j < positon2.y; j++) {
            p({x: i, y: j})
        }
    }
}

function p(positon){
    var img = $('<img class="item debug" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAALCAYAAAB7/H1+AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAD5JREFUeJxjYCAS/NfUbABhYtUTbSA6prqBZFtArIFEW0CugTgtoJaBNLeAfmFMrgVEG0isBWQbiMsCYtUDADFr3ZvN0vaSAAAAAElFTkSuQmCC">')
    drawImgOnMap(img, {x: positon.x, y: positon.y})
}