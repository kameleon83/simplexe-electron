/*jshint esversion: 6 */

class Simplexe {
    constructor(x, y, z, r) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
    }
}

class MaxSimplexe {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

$('.return').click(function(){
    window.history.back()
})

function disableInputResult(){
    $('.start .row').each(function(e){
        let i = e + 1;
        let x = $(this).find('.X-'+i).val();
        let y = $(this).find('.Y-'+i).val();
        let z = $(this).find('.Z-'+i).val();
        let r = $(this).find('.result-'+i);
        if (x.length === 0 && y.length === 0 && z.length === 0) {
            r.attr("disabled", true);
            r.val("");
        }else{
            r.attr("disabled", false);
        }
    })
}

function disableInputVar(){
    var x,y,z,r;
    $('.start .row').each(function(e){
        let i = e + 1;
        x += $(this).find('.X-'+i).val();
        y += $(this).find('.Y-'+i).val();
        z += $(this).find('.Z-'+i).val();
        r += $(this).find('.result-'+i).val();

    })
    if (x.length < 10) {
        $('.MaxX').attr('disabled', true).val("")
        $('.by-default span.default-x').remove()
    }else{
        if (!$('.by-default span').hasClass("default-x")){
            $('.by-default').append("<span class='default-x'>X &ge; 0</span>")
        }
        $('.MaxX').attr('disabled', false)
    }
    if (y.length < 10) {
        $('.MaxY').attr('disabled', true).val("")
        $('.by-default span.default-y').remove()
    }else{
        if (!$('.by-default span').hasClass("default-y")){
            $('.by-default').append("<span class='default-y'>Y &ge; 0</span>")
        }
        $('.MaxY').attr('disabled', false)
    }

    if (z.length < 10) {
        $('.MaxZ').attr('disabled', true).val("")
        $('.by-default span.default-z').remove()
    }else{
        if (!$('.by-default span').hasClass("default-z")){
            $('.by-default').append("<span class='default-z'>Z &ge; 0</span>")
        }
        $('.MaxZ').attr('disabled', false)
    }

    if (r.length < 10 ) {
        $('.submit').attr('disabled', true)
    }else{
        $('.submit').attr('disabled', false)

    }

    if (!$('.by-default span').hasClass('default-x') && !$('.by-default span').hasClass('default-y') && !$('.by-default span').hasClass('default-z')) {
        $('.default-str').remove()
    }else{
        if (!$('.by-default span').hasClass("default-str")){
            $('.by-default').prepend('<span class="default-str">Par défault : </span>')
        }
    }
}

disableInputResult()

$('input').on('keyup click', function(){
    disableInputResult()
    disableInputVar()
})

function tab_std(){
    let tab = []

    $('.row').each(function(e){
        let i = e + 1;
        let x = $(this).find('.X-'+i).val() == 0 ? 0 : $(this).find('.X-'+i).val();
        let y = $(this).find('.Y-'+i).val() == 0 ? 0 : $(this).find('.Y-'+i).val();
        let z = $(this).find('.Z-'+i).val() == 0 ? 0 : $(this).find('.Z-'+i).val();
        let r = $(this).find('.result-'+i).val();
        if (r.length > 0){
            tab[e] = new Simplexe(x, y, z, r);
        }

    });
    let x = $('.MaxX').val() == 0 ? 0 : $('.MaxX').val();
    let y = $('.MaxY').val() == 0 ? 0 : $('.MaxY').val();
    let z = $('.MaxZ').val() == 0 ? 0 : $('.MaxZ').val();
    tab.push(new MaxSimplexe(x, y, z));
    return tab;
}

var newTab = [];

function affiche_tab(){
    let t = tab_std();
    let t_count = tab_std().length;
    let xTrue = false;
    let str = "";
    let yTrue = false;
    let zTrue = false;
    let var_ecart = [];
    if (t_count > 0){
        for (var i = 0; i < t_count-1; i++) {
            var_ecart.push(`e${i+1}`);
            if (t[i].x.length > 0) {
                xTrue = true
            }
            if (t[i].y.length > 0) {
                yTrue = true
            }
            if (t[i].z.length > 0) {
                zTrue = true
            }
        }
    }
    str += `<table class="table table-bordered table-0"><thead><th></th>${xTrue ? "<th>X</th>" : ""}${yTrue ? "<th>Y</th>" : ""}${zTrue ? "<th>Z</th>" : ""}`
    for (var v of var_ecart) {
        str += `<th>${v}</th>`
    }

    str += `<th></th></thead><tbody>`
    for (var i = 0; i < t_count; i++) {

        var temp =[]

        temp.push(xTrue ? parseInt(t[i].x, 10) : 0);
        temp.push(yTrue ? parseInt(t[i].y, 10) : 0);
        temp.push(zTrue ? parseInt(t[i].z, 10) : 0);
        for (var v of var_ecart) {
            temp.push( i + 1 == v.substring(1) ? 1 : 0 )
        }
        temp.push(t[i].r != null ? parseInt(t[i].r,10) : 0);
        newTab.push(temp)

        if (i + 1  < t_count){
            str += `<tr><td>${var_ecart[i]}</td>`
            str += `${xTrue ? "<td>" + t[i].x + "</td>" : ""}${yTrue ? "<td>" + t[i].y + "</td>" : ""}${zTrue ? "<td>" + t[i].z + "</td>" : ""}`
            for (var v of var_ecart) {
                if (v == var_ecart[i]) {
                    str += `<td>1</td>`
                }else{
                    str += `<td>0</td>`
                }
            }
            str += ``
            str += `<td>${t[i].r}</td></tr>`
        }else{
            str += `<tr><td>Max</td>`
            str += `${xTrue ? "<td>" + t[i].x + "</td>" : ""}${yTrue ? "<td>" + t[i].y + "</td>" : ""}${zTrue ? "<td>" + t[i].z + "</td>" : ""}`
            for (var v of var_ecart) {
                str += `<td>0</td>`

            }
            str += ``
            str += `<td></td></tr>`

        }
    }
    str += "</tbody></table>"
    localStorage.setItem("storageTab", JSON.stringify(str))
    localStorage.setItem("firstTab", JSON.stringify(newTab))
    window.location.href = 'calcul.html'

}


win.loadURL(`file://${__dirname}/calcul.html`);
