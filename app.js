require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');

// const {mostrarMenu,pausa} = require('./helpers/mensajes');

const { inquirerMenu,
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoCheckList
} = require('./helpers/inquirer');

const Tareas = require('./models/tareas');

const main = async() => {
    
    // console.log('Hola Mundo');

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if(tareasDB){   //cargar tareas

        tareas.cargarTareasFromArray(tareasDB);
    }

    do{
        //Imprimir el menu
        opt = await inquirerMenu();
        // console.log({opt});
        switch (opt) {
            case '1':
                //crear opcion
                const desc = await leerInput('Descripcion:');
                tareas.crearTarea(desc);
            break;

            case '2':
                tareas.listadoCompleto();
            break;

            case '3':   //listar completadas
                tareas.listarPendientesCompletadas(true);
            break;

            case '4':   //listar pendientes
                tareas.listarPendientesCompletadas(false);
            break;

            case '5':   //completado o pendiente
                const ids = await mostrarListadoCheckList(tareas.listadoArr);
                tareas.toggleComletadas(ids);
            break;

            case '6':   //Borrar
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if(id!=='0'){
                    const ok = await confirmar('¿Está seguro?');
                    if(ok){
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada');
                    }
                }
            break;
        }

        guardarDB(tareas.listadoArr);

        // const tarea = new Tarea('Comprar comida');
        // const tareas = new Tareas();
        // tareas._listado[tarea.id] = tarea;
        // console.log(tareas);

        await pausa();
    }while (opt !== '7');

}

main();