// Variables necesarias

const actions = []

const LLAVE_TIEMPO = "tiempo"

let lista_horas = []

let minutosDiv = document.querySelector('.minutos')
let segundosDiv = document.querySelector('.segundos')
let milesimasDiv = document.querySelector('.milesimas')
let historialDiv = document.querySelector('.historial')

let minutos = 0
let segundos = 0
let milesimas = 0

let running = false

let events = {
    "Contar" : correrConteo,
    "Pausar" : pausarConteo,
    "Borrar conteo" : borrarConteo,
}

function setClickActions(action) {
    action.onclick = events[action.textContent]
}

function actualizarContadores() {
    milesimas++
    if (milesimas == 100) {
        segundos++
        milesimas = 0
    }

    if(segundos == 60) {
        minutos++
        segundos = 0
    }

    if(minutos == 60) {
        minutos = 0
    }

    milesimasDiv.textContent = formatear(milesimas)
    segundosDiv.textContent = formatear(segundos)
    minutosDiv.textContent = formatear(minutos)
}

function formatear(number) {
    let string = ''
    if(number < 10) {
        string = "0" + number
    } else {
        string = number.toString()
    }

    return string
}

function correrConteo() {
    if(running === false) {
        running = true
        cronometro_id = setInterval(actualizarContadores, 10)
    }
}

function pausarConteo() {
    // debugger
    if(running === true) {
        running = false
        clearInterval(cronometro_id)
    }
}

function borrarConteo() {
    if (running === true) {
        running = false;
        clearInterval(cronometro_id)
        cronometro_id = undefined
    }
    actualizarHistorial(milesimas, segundos, minutos)
    reiniciarContadores()
}

function actualizarHistorial(milesimas, segundos, minutos) {
    if(milesimas === 0 && segundos === 0 && minutos === 0)
    {
        return
    }

    let ultimaHora = `${formatear(minutos)}:${formatear(segundos)}:${formatear(milesimas)}`
    lista_horas.push(ultimaHora)
    localStorage.setItem(LLAVE_TIEMPO, JSON.stringify(lista_horas))
    let p = document.createElement('p')
    p.textContent = ultimaHora
    historialDiv.appendChild(p)

}

function reiniciarContadores() {
    minutos = 0
    segundos = 0
    milesimas = 0
    milesimasDiv.textContent = formatear(milesimas)
    segundosDiv.textContent = formatear(segundos)
    minutosDiv.textContent = formatear(milesimas)
}

function main() {
    console.log("hello world")
    
    lista_horas = JSON.parse(
        localStorage.getItem(LLAVE_TIEMPO) || '[]'
        )
        
    for (const hora of lista_horas) {
        console.log(hora);
        const p = document.createElement('p')
        p.textContent = hora
        historialDiv.appendChild(p)
    }
    

    document.querySelectorAll("button").forEach(button => actions.push(button))

    // crear timer
    let cronometro_id = setInterval(actualizarContadores, 10)
    clearInterval(cronometro_id)

    // Asignar event listeners
    for (const action of actions) {
        setClickActions(action);
    }
}

main()