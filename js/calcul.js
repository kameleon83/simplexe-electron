/*jshint esversion: 6 */

$('.table_simplexe').before("<h3>Tableau n°0 - initialisation</h3>");
$('.table_simplexe').html(JSON.parse(localStorage.getItem("storageTab")));

var firstTab = JSON.parse(localStorage.getItem("firstTab"))

function deleteCol(tab){
    var x = 0;
    var y = 0;
    var z = 0;
    for (var i = 0; i < tab.length; i++) {
        x += tab[i][0]
        y += tab[i][1]
        z += tab[i][2]
    }
    for (var i = 0; i < tab.length; i++) {
        if ( z === 0 ){
            tab[i].splice(2,1)
        }
        if ( y === 0 ){
            tab[i].splice(1,1)
        }
        if ( x === 0 ){
            tab[i].splice(0,1)
        }
    }
    return tab
}

var fTab = deleteCol(firstTab);

class EcoPlusGrand{
    constructor(col, row, nbr){
        this.col = col
        this.row = row
        this.nbr = nbr
    }
}
class ResultatPlusPetit{
    constructor(col, row, nbr){
        this.col = col
        this.row = row
        this.nbr = nbr
    }
}
class Pivot{
    constructor(col, row, nbr){
        this.col = col
        this.row = row
        this.nbr = nbr
    }
}

class FirstColVar {

    static col(col, tab){
        let calcVar = (tab[0].length - 1) - (tab.length - 1);
        if (calcVar === 1) {
            if (col === 0) return "X";
            if (col === 1) return "e1";
            if (col === 2) return "e2";
            if (col === 3) return "e3";
            if (col === 4) return "e4";
        }else if (calcVar === 2) {
            if (col === 0) return "X";
            if (col === 1) return "Y";
            if (col === 2) return "e1";
            if (col === 3) return "e2";
            if (col === 4) return "e3";
            if (col === 5) return "e4";
        }else if (calcVar === 3) {
            if (col === 0) return "X";
            if (col === 1) return "Y";
            if (col === 2) return "Z";
            if (col === 3) return "e1";
            if (col === 4) return "e2";
            if (col === 5) return "e3";
            if (col === 6) return "e4";
        }
    }
}

function searchPivot(tab){
    let l = tab.length - 1
    let coefFuncEco = new EcoPlusGrand(0,0,0)
    let rPlusPetit = new ResultatPlusPetit(0,0,9999999999999999)


    for (var i = 0; i < tab[l].length; i++) {
        if (tab[l][i] > coefFuncEco.nbr){
            coefFuncEco.row = l;
            coefFuncEco.col = i;
            coefFuncEco.nbr = tab[l][i]
        }
    }

    for (var i = 0; i < tab.length; i++) {
        let r = tab[i].length - 1
        let calculDivisionColPivotResult = tab[i][r] / tab[i][coefFuncEco.col]
        let calculDiffPlusPetit = 0
        if ((rPlusPetit.nbr / tab[rPlusPetit.row][coefFuncEco.col]) < 0) {
            calculDiffPlusPetit = (rPlusPetit.nbr / tab[rPlusPetit.row][coefFuncEco.col]) * -1
        }else{
            calculDiffPlusPetit = (rPlusPetit.nbr / tab[rPlusPetit.row][coefFuncEco.col])
        }

        if (calculDivisionColPivotResult < calculDiffPlusPetit && calculDivisionColPivotResult > 0){
            // console.log(tab[i][r] ,rPlusPetit.nbr,rPlusPetit.row, rPlusPetit.col,tab[i][r] / tab[i][coefFuncEco.col] )
            rPlusPetit.col = r
            rPlusPetit.row = i
            rPlusPetit.nbr = tab[i][r]
        }
    }

    return new Pivot(coefFuncEco.col,rPlusPetit.row,tab[rPlusPetit.row][coefFuncEco.col])
}


function affichePivot(tab, ite){
    let pivot = searchPivot(tab);
    $(`.table-${ite}`)
    .find('tr:nth-child('+(pivot.row + 1)+')')
    .find('td:nth-child('+(pivot.col + 2 )+')')
    .addClass("pivot")
}

function notif(){
    new Notification('Le calcul est terminée', {
        body: 'Félicitations !! Le résultat est arrivé. Regardez tout en bas de la page',
        icon: './images/sokys.png'
    });
}

var nbr_ite = 1
var pivotVarCol = []

function calculIte(tab){
    let pivot = searchPivot(tab)

    let t = false

    if (pivotVarCol.length == 0) {
        pivotVarCol.push({ "Name" : FirstColVar.col(pivot.col, tab),
        "Row" : pivot.row,
        "Ite" : nbr_ite})

    }else{
        for (var i = 0; i < pivotVarCol.length; i++) {
            if (pivotVarCol[i].Row == pivot.row) {
                pivotVarCol.splice(i,1)

            }
        }

        pivotVarCol.push({ "Name" : FirstColVar.col(pivot.col, tab),
        "Row" : pivot.row,
        "Ite" : nbr_ite})
    }

    if (nbr_ite === 1) {
        $(`.table-0`)
        .find('tr:nth-child('+(pivot.row + 1)+')')
        .find('td:nth-child('+(pivot.col + 2 )+')')
        .addClass("pivot")
    }
    for (var i = 0; i < tab.length; i++) {
        var Aij = tab[i][pivot.col]
        if (i != pivot.row){
            for (var j = 0; j < tab[i].length; j++) {
                let Eij = tab[i][j]
                let linePivot = tab[pivot.row][j]
                tab[i][j] = Eij - ( ( Aij / pivot.nbr ) * linePivot)
            }
        }
    }
    for (var j = 0; j < tab[pivot.row].length; j++) {
        let Eij = tab[pivot.row][j]
        tab[pivot.row][j] = Eij / pivot.nbr
    }

    afficheIte(tab, nbr_ite)
    nbr_ite++

    if (nbr_ite > 100) {
        $('body').prepend("<h1>Apparemment une erreur est arrivée!! Ca fait 100 fois que le logiciel essaye de calculer.<br>Il faudrait peut-être recommencer :-(</h1>").css('color', 'red')
        return tab
    }

    if (!checkMaxNegatif(tab)){
        return calculIte(tab)
    }else{
        notif()
        return tab
    }
}


function checkMaxNegatif(tab){
    let n = 0
    let l = tab[tab.length-1]
    for (var i = 0; i < l.length; i++) {
        if (l[i] > 0 ){
            n++
        }
    }
    if (n === 0) {
        return true
    }else{
        return false
    }
}

function afficheIte(tab, ite){
    let str = ""
    str += "<h3>Tableau n°"+ ite +"</h3>";
    let l1 = tab.length - 1
    let l2 = tab[0].length - 1
    let calcVar = l2-l1;

    str += `<table class="table table-bordered table-${ite}" data-ite="${ite}"><thead><th></th>`
    for (var i = 0; i < calcVar; i++) {
        if (i === 0 ) {
            str += `<th>X</th>`
        }
        if (i === 1 ) {
            str += `<th>Y</th>`
        }
        if (i === 2 ) {
            str += `<th>Z</th>`
        }
    }
    for (var i = 0; i < l1; i++) {
        str += `<th>e${i+1}</th>`
    }
    str += `<th></th></thead><tbody>`

    for (var i = 0; i < tab.length; i++) {
        if ( i < tab.length -1){
            str += `<tr>`
            let test = false
            let count = 0
            for (var p = 0; p < pivotVarCol.length; p++) {
                if (pivotVarCol[p].Ite <= ite && pivotVarCol[p].Row == i) {
                    str += `<td>${pivotVarCol[p].Name}</td>`
                    count++
                }else{
                    test = true
                }
            }
            if (test && count === 0) {
                str += `<td>e${i+1}</td>`
            }
        }else{
            str += `<tr><td>Max</td>`
        }
        for (var j = 0; j < tab[i].length; j++) {
            let v = tab[i][j]
            str += `<td>${Number.isInteger(v) ? v : v.toFixed(3)}</td>`
        }
        str += `</tr>`
    }
    str += `</tbody></table>`
    $('.table_simplexe').data('ite',ite-1).append(str)
    if ( ite < nbr_ite + 1) {
        affichePivot(tab,ite)
    }
}

lastTab = calculIte(fTab);

function afficherResultat(tab){
    let x,y,z,r
    for (var i = 0; i < pivotVarCol.length; i++) {
        let name = pivotVarCol[i].Name
        if (name == "X"){
            $(`.table-${nbr_ite - 1} tbody tr:nth-child(${pivotVarCol[i].Row+1})`).addClass("final")
            x = tab[pivotVarCol[i].Row][tab[pivotVarCol[i].Row].length - 1];
        }
        if (name == "Y"){
            $(`.table-${nbr_ite - 1} tbody tr:nth-child(${pivotVarCol[i].Row+1})`).addClass("final")
            y = tab[pivotVarCol[i].Row][tab[pivotVarCol[i].Row].length - 1];
        }
        if (name == "Z"){
            $(`.table-${nbr_ite - 1} tbody tr:nth-child(${pivotVarCol[i].Row+1})`).addClass("final")
            z = tab[pivotVarCol[i].Row][tab[pivotVarCol[i].Row].length - 1];
        }
    }
    r = tab[tab.length - 1][tab[tab.length - 1].length - 1]

    let str = ""
    str += `<p>La marge sur coût variable maximum est de ${Number.isInteger(r) ? r * -1 : (r * -1).toFixed(3)}</p>`
    str += `<p>Les quantités produites sont de : </p>`
    str += `<ul class="list-group">`
    if (x != null){
        str += `<li class="list-group-item">x = ${Number.isInteger(x) ? x : x.toFixed(3)}</li>`
    }else if (localStorage.getItem("xTrue")) {
        str += `<li class="list-group-item">x = 0</li>`
    }
    if (y != null){
        str += `<li class="list-group-item">y = ${Number.isInteger(y) ? y : y.toFixed(3)}</li>`
    }else if (localStorage.getItem("yTrue")) {
        str += `<li class="list-group-item">y = 0</li>`
    }
    if (z != null){
        str += `<li class="list-group-item">z = ${Number.isInteger(z) ? z : z.toFixed(3)}</li>`
    }else if (localStorage.getItem("zTrue")) {
        str += `<li class="list-group-item">z = 0</li>`;
    }
    str += `</ul>`

    $('.table_simplexe').data('ite',nbr_ite-1).append(str)
    localStorage.clear();
}

afficherResultat(lastTab)

$(`.table-${nbr_ite-1} tr td`).css("background-color", "transparent")
