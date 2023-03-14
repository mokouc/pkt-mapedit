
const uw = 20
const uh = 10

const defaultAimImg = $('<img l="1" w="1" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAYAAAB3AH1ZAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAJhJREFUeJy1lN0JwDAIhJ2pO2XbjtE9Ukox2ItSTE7Bh5Dgff5FZMHOJv3xfr2u55VYaWEVjbwMxMsYvRSiHdKtoyDeb4lpQEYmqVj6mFlKW6kQBIXZfcTh/YCgsO0pCwBnxoKMS3xQWQHVG0nayWavk7e+4aYgCAvgVzgCYcwB9W/I+C74ZNEkV2/QBBGBpHq8a97fv1r2G5nbd6g1vHWyAAAAAElFTkSuQmCC">')

const fileNameRegex = /\](\S*)\./
const modelRegex = /\[(\S*?)x(\S*?)\]/
const floorRegex = /\[F\]/
const tailRegex = /\.(\S*)/

$(document).ready(function() {

    const map = $('#map')
    const aim = $('#aim')

    setAimByIcon(aim, defaultAimImg)

    /**
     * 按键事件
     */
    $(window).keydown(function(e) {
        switch(e.keyCode) {
            case 16: aim.addClass('mirro'); break
            case 17: aim.addClass('delete hidden'); break
        }
    })

    $(window).keyup(function(e) {
        switch(e.keyCode) {
            case 16: aim.removeClass('mirro'); break
            case 17: aim.removeClass('delete hidden'); break
        }
    })

    /**
     * 鼠标进出地图容器
     */
    $('.map-container').mouseleave(function(e) {
        aim.addClass('hidden')
    })

    $('.map-container').mouseenter(function(e) {
        aim.removeClass('hidden')
    })

    /**
     * 鼠标移动
     * - 在地图上绘制准星
     */
    $('.map-container').mousemove(function(e) {
        // $('.aim').remove()
        var position = getXYOnMap(map, {x: e.pageX, y: e.pageY})
        getPositionByXY(aim, position)
        // map.append(getPositionByXY(aim, position))
    })

    /**
     * 地图点击事件
     */
    $('.map-container').click(function(e) {
        if(aim.is('.delete') || $('.icon.selected').length == 0) {
            return
        }
        var position = getXYOnMap(map, {x: e.pageX, y: e.pageY})
        var icon = $('.icon.selected').clone().removeClass('icon selected').addClass(aim.is('.mirro') ? 'mirro' : '')
        var item = buildItemByIcon(icon, position)
        map.append(getPositionByXY(item, position))
    })

    /**
     * 地图物品点击事件
     */
    $('.map-container').on('click','.item',  function(e) {
        if(aim.is('.delete')) {
            e.stopPropagation()
            this.remove()
            return
        }
    })

    /**
     * 工具栏点击事件
     */
    $('.tool-container').click(function(e) {
        $('.upload').click()
    })
    
    /**
     * 工具栏图标点击事件
     */
    $('.tool-container').on('click', '.icon', function(e) {
        e.stopPropagation()
        var icon = $(this)

        if(aim.is('.delete')) {
            setAimByIcon(aim, defaultAimImg)
            $(this).remove()
            return
        }

        if(icon.is('.selected')) {
            setAimByIcon(aim, defaultAimImg)
        } else {
            setAimByIcon(aim, icon.clone().removeClass('icon selected'))
            $('.icon.selected').removeClass('selected')
        }
        icon.toggleClass('selected')
    })

    /**
     * 上传图片资源事件
     */
    $('.upload').change(function(e) {
        $(this.files).each(function() {
            $('.tool-container').append(buildIconByFile(this))
        })
        this.value = ''
    })
})

function getXYOnMap(map, position) {
    return {
        x: Math.round((position.y - map.offset().top) / uh + (position.x - map.offset().left) / uw),
        y: Math.round((position.y - map.offset().top) / uh - (position.x - map.offset().left) / uw),
    }
}

function getPositionByXY(item, position) {
    var l = (item.attr('l') % 2 == 1) ? 0 : 1
    var w = (item.attr('w') % 2 == 1) ? 0 : 1

    console.clear()
    console.log(item.attr('l') + ',' + item.attr('w'))
    console.log(l + ',' + w)

    return item.css({
        left: (position.x - position.y) * uw / 2 - (l - w) * uw / 4 - item[0].width / 2,
        top: (position.x + position.y) * uh / 2 - (l + w) * uh / 4 - item[0].height + (item[0].width / 4),
    })
}

function buildIconByFile(file) {
    var reader = new FileReader()
    var img = $(`<img class="icon" title="${file.name.replace(modelRegex, '').replace(floorRegex, '').replace(tailRegex, '')}">`)
    img = (modelTag = file.name.match(modelRegex)) == null ? img : img.addClass('model').attr({l: modelTag[1], w: modelTag[2]})
    img = (modelTag = file.name.match(floorRegex)) == null ? img : img.addClass('floor')

    reader.readAsDataURL(file)
    reader.addEventListener('load', function() {
        img.attr({src: reader.result})
    })
    return img
}

function buildItemByIcon(icon, position) {
    var item = $('<div class="item"></div>').addClass(icon.attr('class')).attr({l: icon.attr('l'), w: icon.attr('w')})
    item.css({width: item[0].width = icon[0].width, height: item[0].height = icon[0].height})

    console.log(item.attr('class'))

    if(!item.is('.model') || item.is('.floor')) {
        item.append(icon)
        return item
    }

    icon.css('width', '10px') 

    var l = (item.is('.mirro') ? icon.attr('w') : icon.attr('l')) * 1
    var w = (item.is('.mirro') ? icon.attr('l') : icon.attr('w')) * 1

    for(let i = 0; i <= l + w; i++) {
        var x = position.x * 1 + parseInt((i < l) ? (i - l / 2 + 1) : (l / 2 ))
        var y = position.y * 1 + parseInt((i < l) ? (w / 2) : (w / 2 - (i - l)))
        var off = item.is('.mirro') ? (-item[0].width + (i + 1) * uw / 2) : (-i * uw / 2)
        icon.clone().css('z-index', x + y).css('object-position', `${off}px`).appendTo(item)
    }
    icon.remove()
    return item
}

function setAimByIcon(aim, icon) {
    aim.css({width: aim[0].width = icon[0].width, height: aim[0].height = icon[0].height}).attr({l: icon.attr('l'), w: icon.attr('w')})
    aim.children().replaceWith(icon)
    return aim
}