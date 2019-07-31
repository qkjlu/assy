function fetchOF(){
    
    const of = document.getElementById('of').value
    const xhr = new XMLHttpRequest();
    xhr.open('get', `http://localhost:3000/of/${of}`)
    xhr.send()
    xhr.onreadystatechange = () => {
        console.log(xhr.responseText)
        const JSONresponse = JSON.parse(xhr.response)
        let tr = ''
        for (const row of JSONresponse) {
            tr += `<tr>
            <th scope="row">${row['Comp_ Serial No_']}</th>
            <td>${row['Comp_ Item No_']}</td>
            <td>${row['Comp_ Description']}</td>
            <td>${row['Comp_ Lot No_']}</td>
            <td>${row['Serial No_']}</td>
            </tr>`
        }
        document.getElementById('ofData').innerHTML = tr
    }
}

const kUp = function (e) {
    if(e.code == 'Enter') {
        fetchOF()
    }
}




