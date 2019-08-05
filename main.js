function fetchOF(){
    const ens = new Ensemble(document.getElementById('of').value)
        ens.fetchAll( () => {
            document.getElementById('data').innerHTML = ens.render()
        })
}

const colorize = (element, event) => {
    event.stopPropagation()
    element.style.borderColor == "" ? element.style.borderColor = "Lime" : element.style.borderColor = ""
}

const kPress = function (e) {
    if(e.code == 'Enter' || e.code == 'NumpadEnter') {
        fetchOF()
    }
}

class Ensemble {
    constructor(num){
        const composant = new Composant("OF", num)
        this._root = composant
    }

    fetchAll(callback){
       this._root.fetchChildren(callback)
    }
    render() {
        return this._root.render()
    }

    flatten(){
        const out = {}
        this._root.getChilds().forEach((child)=> {
            while( !child.isLeaf() ) {
                //Trouver un moyen de descendre tout en bas de l'arbre
                out[child.getNum()].push(child.getSerial())    
            }
            
        })
    }
}


class Composant {
    constructor(type, num, descr){
        if(type == 'undefined'){
            throw new Error("Un composant doit avoir un type (e.g: OF, OA, ...) ")
        }
        if(this.num == 'undefined'){
            throw new Error("Un composant doit avoir un numéro")
        }
        if(this.descr == 'undefined') {
            throw new Error("Un composant doit avoir une description")
        }
        this.type = type
        this.composants = []
        this.descr = descr
        this.serial = 'undefined'
        this.addNum(num);
    }
    
    getChilds(){
        return this.composants
    }

    getNum(){
        return this.num
    }

    isLeaf(){
        return this.getChilds().length == 0
    }

    fetchChildren(callback){
        if(this.type == 'OF'){
            this.serial != 'undefined' ? this.fetchChildren_OFWithSerial(callback) : this.fetchChildren_OFWithoutSerial(callback)
        }
    }
    fetchChildren_OFWithoutSerial(callback){
        const xhr = new XMLHttpRequest()
        xhr.open('get', `http://localhost:3000/of/${this.num}`)
        xhr.send()
        xhr.onload = () => {
            const json = JSON.parse(xhr.response)
            
            json.forEach( value => {
                if(this.isOF(value)){
                    const num = value["Comp_ Serial No_"]
                    const descr = value["Comp_ Description"]
                    const composant = new Composant("OF", num, descr)
                    this.composants.push(composant)
                    composant.fetchChildren(callback)
                    
                } else if (this.isMAT(value)){
                    const num = value["Comp_ Lot No_"]
                    const descr = value["Comp_ Description"]
                    const composant = new Composant("OA", num, descr)
                    this.composants.push(composant)
                }

            })
            callback()
        }
    }
    fetchChildren_OFWithSerial(callback){
        if(this.serial == 'undefined'){
            throw new Error("Un OF composant doit avoir au moins un N° de série spécifié")
        }
        const xhr = new XMLHttpRequest()
        xhr.open('get', `http://localhost:3000/of/${this.num}/${this.serial}`)
        xhr.send()
        xhr.onload = () => {
            const json = JSON.parse(xhr.response)
            json.forEach( value => {
                if(this.isOF(value)){
                    const num = value["Comp_ Serial No_"]
                    const descr = value["Comp_ Description"]
                    const composant = new Composant("OF", num, descr)
                    this.addComposant(composant)
                    composant.fetchChildren(callback)
                    
                } else if (this.isMAT(value)){
                    const num = value["Comp_ Lot No_"]
                    const descr = value["Comp_ Description"]
                    const composant = new Composant("OA", num, descr)
                    this.addComposant(composant)
                }

            })
            callback()
        } 
    }

    addNum(num){
        this.type == "OF" ? this.addNumOF(num) : 
        this.type == "OA" ? this.addNumOA(num) : 1
    }

    addNumOF(num){
        num.includes('OF') ? this.num = num.split('-')[0].slice(2) : this.num = num.split('-')[0]
        if(num.split('-').length > 1){
            this.setSerial(num.split('-')[1])
        }   
        
    }

    addNumOA(num){
        if(num.includes('OA')){
            this.num = num.slice(2)
        } else {
            this.num = num 
            this.type = "MAT-NO-OA"
        }        
    }

    setSerial(serial) {
        this.serial = serial
    }

    addComposant(composant) {
        this.composants.push(composant)
    }

    isOF(value) {
        let res = undefined
        value["Comp_ Serial No_"].includes("OF") ? res = true : res = false
        return res
    }

    isMAT(value) {
        let res = undefined
        value["Comp_ Item No_"].includes("MAT") ? res = true : res = false
        return res
    }

    isFOURN(value) {
        let res = undefined
        value["Comp_ Item No_"].includes("FOURN") ? res = true : res = false
        return res
    }

    getSerial() {
        return this.serial
    }

    render(){
        const compRender = []
        this.composants.forEach( x => compRender.push(x.render()) )
        return `
        <div style='border-style : solid ; margin : 5px ; padding : 5px' onclick='colorize(this, event)'> 
            ${this.type == 'MAT-NO-OA' ? this.num : this.type + this.num}
            ${this.serial != 'undefined' ? "- " + this.getSerial()  : "" } </br>
            (${this.descr}) ${compRender.join('')}
        </div>`
    }
}



