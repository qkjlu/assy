function fetchOF(){
    
    const of = document.getElementById('of').value
    const xhr = new XMLHttpRequest();
    xhr.open('get', `http://localhost:3000/of/${of}`)
    xhr.send()
    xhr.onreadystatechange = () => {
        document.getElementById('ofData').innerHTML = xhr.response
    }
}

const kUp = function (e) {
    if(e.code == 'Enter') {
        fetchOF()
    }
}



