

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

class Ensemble {
    constructor(num){
        const composant = new Composant("OF", num)
        this._root = composant
    }

    fetchAll(){
        this._root.fetchChildren()
    }
}


class Composant {
    constructor(type, num){
        if(type == 'undefined'){
            throw new Error("Un composant doit avoir un type (e.g: OF, OA, ...) ")
        }
        if(this.num == 'undefined'){
            throw new Error("Un composant doit avoir un numéro")
        }
        this.type = type
        this.serials = []
        this.composants = []
        this.addNum(num);
    }
    fetchChildren(){
        if(this.type == 'OF'){
            this.serials.length != 0 ? this.fetchChildren_OFWithSerial() : this.fetchChildren_OFWithoutSerial()
        }
    }
    fetchChildren_OFWithoutSerial(){
        const xhr = new XMLHttpRequest()
        xhr.open('get', `http://localhost:3000/of/${this.num}`)
        xhr.send()
        xhr.onload = () => {
            const json = JSON.parse(xhr.response)
            json.forEach( value => {
                if(this.isOF(value)){
                    const num = row["Comp_ Serial No_"]
                    const composant = new Composant("OF", num)
                    this.composants.push(composant)
                    composant.fetchChildren()
                    
                } else if (this.isMAT(value)){
                    const num = row["Comp_ Lot No_"]
                    const composant = new Composant("OA", num)
                    this.composants.push(composant)
                }

            })
        }
    }
    fetchChildren_OFWithSerial(){
        if(this.serials.length == 0){
            throw new Error("Un OF composant doit avoir au moins un N° de série spécifié")
        }
        const xhr = new XMLHttpRequest();
        this.serials.forEach( value => {
            xhr.open('get', `http://localhost:3000/of/${this.num}/${value}`)
            xhr.send()
            xhr.onload = () => {
                const json = JSON.parse(xhr.response)
                json.forEach( value => {
                    if(this.isOF(value)){
                        const num = row["Comp_ Serial No_"]
                        const composant = new Composant("OF", num)
                        this.addComposant(composant)
                        composant.fetchChildren()
                        
                    } else if (this.isMAT(value)){
                        const num = row["Comp_ Lot No_"]
                        const composant = new Composant("OA", num)
                        this.addComposant(composant)
                    }

                })
            } 
        })
        
    }

    addNum(num){
        this.type == "OF" ? this.addNumOF(num) : 
        this.type == "OA" ? this.addNumOA(num) : 1
    }

    addNumOF(num){
        this.num = num.split('-')[0].slice(2)
        this.addSerial(num.split('-')[1])
    }

    addNumOA(num){
        num.include('OA') ? this.num = num.slice(2) : this.num = num
    }

    addSerial(serial) {
        this.serials.push(serial)
    }

    addComposant(composant) {
        this.composants.push(composant)
    }

    isOF(row) {
        let res = undefined
        row["Comp_ Serial No_"].include("OF") ? res = true : res = false
        return res
    }

    isMAT(row) {
        let res = undefined
        row["Comp_ Item No_"].include("MAT") ? res = true : res = false
        return res
    }

    isFOURN(row) {
        let res = undefined
        row["Comp_ Item No_"].include("FOURN") ? res = true : res = false
        return res
    }

    render(){

    }
}



