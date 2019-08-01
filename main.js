

function fetchOF(){
    let ofs = {}
    const of = document.getElementById('of').value.replace("-", "/")
    const xhr = new XMLHttpRequest();
    xhr.open('get', `http://localhost:3000/of/${of}`)
    xhr.send()
    xhr.onload = () => {
        
        const JSONresponse = JSON.parse(xhr.response)
        let tr = ''
        
        for (const row of JSONresponse) { 
            const num = row['Comp_ Serial No_'].split('-')
            const pere = row['Serial No_'].split('-')
            if ( ofs[num[0]] === undefined ) {
                ofs[num[0]] = {}
                ofs[num[0]].fils = []
                ofs[num[0]].pere = []   
                
            } 
            ofs[num[0]].fils.push(num[1]) 
            ofs[num[0]].pere.push(pere[2])
            ofs[num[0]].pn = row['Comp_ Item No_']
            ofs[num[0]].descr = row['Comp_ Description']
            ofs[num[0]].lot = row['Comp_ Lot No_']
        }   
        
        for (const of in ofs) {
            // Construction de la chaine d'OF composants
            
            col1 = of
            let lastel = ''
            for (const el of ofs[of].fils) {
                if(col1 === of){
                    col1 += '-' + el
                } else if(parseInt(lastel)+1 == parseInt(el)){
                    if(col1.slice(-2) != 'to') {
                        col1 += 'to'
                    }
                } else if (parseInt(lastel)+1 != parseInt(el)) {
                    if(col1.slice(-2) == 'to') {
                        col1 += lastel + '-' + el
                    } else {
                        col1 += '-' + el
                    }
                }
                lastel = el;
            }
            if(col1.slice(-2) == 'to'){
                col1 += lastel
            } 
        
            

            // Construction de la chaine de numéro de série 
            let col2 = ''
            lastel = ''
            for (const el of ofs[of].pere) {
                if(col2 === ''){
                    col2 += el
                } else if(parseInt(lastel)+1 == parseInt(el)){
                    if(col2.slice(-2) != 'to') {
                        col2 += 'to'
                    }
                } else if (parseInt(lastel)+1 != parseInt(el)) {
                    if(col2.slice(-2) == 'to') {
                        col2 += lastel + '-' + el
                    } else {
                        col2 += '-' + el
                    }
                }
                lastel = el;
            }
            if(col2.slice(-2) == 'to'){
                col2 += lastel
            } 

            tr += `<tr>
            <th scope="row">${col1}</th>
            <td>${ofs[of].pn}</td>
            <td>${ofs[of].descr}</td>
            <td>${ofs[of].lot}</td>
            <td>${col2}</td>
            </tr>`;
        }
        
        document.getElementById('ofData').innerHTML = tr
    }
}


const kPress = function (e) {
    if(e.code == 'Enter') {
        const of = new OF(document.getElementById('of').value)
        //fetchOF()
    }
}

class OF {
    constructor(num){
        this.num = num
        this.composants = []
        this.fetch()
    }

    fetch() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', `http://localhost:3000/of/${this.num}`)
        xhr.send()
        xhr.onload = () => {
            for (const row of JSON.parse(xhr.response)) {
                if(this.isAssy(row)) {
                    // Si le composant est un ensemble alors on crée un OF qui va s'auto-fetch
                    const composant = new Composant("OF")
                    this.composants.push(new Composant(row["Comp_ Serial No_"]))
                } else {
                    this.composants.push(row)
                }
                
            }
            
        }
    }

    isAssy(row) {
        let res = undefined
        row["Comp_ Serial No_"] == "" ? res = false : res = true
        return res
    }
}

class Composant {
    constructor(type){
        this.type = type
    }
}



