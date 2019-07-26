function getFile(filename){
    const xhr = new XMLHttpRequest();
    xhr.open('get', `localhost:3000/file/${filename}`);
    xhr.onreadystatechange = () => {
        document.getElementById('test').innerHTML = xhr.response
    }
}

document.getElementById('ok').addEventListener('click', () => {
    getFile()
})



