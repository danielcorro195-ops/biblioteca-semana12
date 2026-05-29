// =============================
// MODELO
// =============================

class Libro {

    #id;
    #titulo;
    #autor;
    #anio;
    #categoria;
    #disponible;
    #lecturas;

    constructor(id,titulo,autor,anio,categoria,disponible=true){

        this.#id=id;
        this.#titulo=titulo;
        this.#autor=autor;
        this.#anio=anio;
        this.#categoria=categoria;
        this.#disponible=disponible;
        this.#lecturas=0;

    }

    getId(){ return this.#id; }
    getTitulo(){ return this.#titulo; }
    getAutor(){ return this.#autor; }
    getAnio(){ return this.#anio; }
    getCategoria(){ return this.#categoria; }
    isDisponible(){ return this.#disponible; }
    getLecturas(){ return this.#lecturas; }

    incrementarLecturas(){
        this.#lecturas++;
    }

}

// =============================
// BIBLIOTECA
// =============================

class Biblioteca {

    #libros;
    #contadorId;

    constructor(){

        this.#libros=[];
        this.#contadorId=1;

        this.inicializarDatos();

    }

    inicializarDatos(){

        this.agregarLibro(
            "El Quijote",
            "Miguel de Cervantes",
            1605,
            "Literatura"
        );

        this.agregarLibro(
            "Cien años de soledad",
            "Gabriel García Márquez",
            1967,
            "Literatura"
        );

        this.agregarLibro(
            "La sombra del viento",
            "Carlos Ruiz Zafón",
            2001,
            "Ficción"
        );

    }

    agregarLibro(titulo,autor,anio,categoria){

        const existe=this.#libros.some(libro=>

            libro.getTitulo().toLowerCase()===titulo.toLowerCase()
            &&
            libro.getAutor().toLowerCase()===autor.toLowerCase()

        );

        if(existe){
            return null;
        }

        const nuevoLibro=new Libro(
            this.#contadorId++,
            titulo,
            autor,
            anio,
            categoria
        );

        this.#libros.push(nuevoLibro);

        return nuevoLibro;

    }

    listarLibros(){
        return [...this.#libros];
    }

    obtenerMasLeidos(){

        return [...this.#libros].sort(
            (a,b)=>b.getLecturas()-a.getLecturas()
        );

    }

}

// =============================
// CONTROLADOR
// =============================

class ControladorBiblioteca {

    constructor(){

        this.biblioteca=new Biblioteca();

        this.simularLecturas();

        this.actualizarTabla();

    }

    simularLecturas(){

        this.biblioteca.listarLibros().forEach(libro=>{

            const veces=Math.floor(Math.random()*10);

            for(let i=0;i<veces;i++){
                libro.incrementarLecturas();
            }

        });

    }

    actualizarTabla(){

        const tbody=document.getElementById("cuerpoTabla");

        tbody.innerHTML="";

        this.biblioteca.listarLibros().forEach(libro=>{

            const fila=tbody.insertRow();

            fila.insertCell(0).textContent=libro.getId();
            fila.insertCell(1).textContent=libro.getTitulo();
            fila.insertCell(2).textContent=libro.getAutor();
            fila.insertCell(3).textContent=libro.getAnio();
            fila.insertCell(4).textContent=libro.getCategoria();

            const estado=fila.insertCell(5);

            estado.innerHTML=
            `<span class="badge bg-success">
                Disponible
            </span>`;

            fila.insertCell(6).textContent=
            libro.getLecturas();

        });

    }

    agregarLibroDesdeFormulario(
        titulo,
        autor,
        anio,
        categoria
    ){

        const libro=this.biblioteca.agregarLibro(
            titulo,
            autor,
            anio,
            categoria
        );

        if(libro===null){

            this.mostrarAlerta(
                "Ya existe un libro con ese título y autor",
                "danger"
            );

            return false;
        }

        this.actualizarTabla();

        this.mostrarAlerta(
            "Libro agregado correctamente",
            "success"
        );

        return true;

    }

    mostrarAlerta(mensaje,tipo){

        const contenedor=
        document.getElementById("alertas");

        contenedor.innerHTML=`
        <div class="alert alert-${tipo}">
            ${mensaje}
        </div>
        `;

        setTimeout(()=>{
            contenedor.innerHTML="";
        },3000);

    }

}

const controlador=
new ControladorBiblioteca();

// =============================
// FUNCIONES GLOBALES
// =============================

function agregarLibro(){

    const titulo=
    document.getElementById("titulo").value.trim();

    const autor=
    document.getElementById("autor").value.trim();

    const anio=
    document.getElementById("anio").value;

    const categoria=
    document.getElementById("categoria").value;

    if(
        titulo==="" ||
        autor==="" ||
        anio===""){
        return;
    }

    const exito=
    controlador.agregarLibroDesdeFormulario(
        titulo,
        autor,
        anio,
        categoria
    );

    if(exito){

        document.getElementById("formLibro").reset();

        const modal=
        bootstrap.Modal.getInstance(
            document.getElementById("modalLibro")
        );

        modal.hide();

    }

}

function mostrarReporte(){

    const reporte=
    controlador.biblioteca.obtenerMasLeidos();

    let mensaje="📚 LIBROS MÁS LEÍDOS\n\n";

    reporte.forEach(libro=>{

        mensaje+=
        `${libro.getTitulo()} - ${libro.getLecturas()} lecturas\n`;

    });

    alert(mensaje);

}

function cambiarTema(){

    document.body.classList.toggle("dark-mode");

}