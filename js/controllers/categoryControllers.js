import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../services/categoryServices.js";

document.addEventListener("DOMContentLoaded", ()=>{
    const tablebody = document.querySelector("#categoriesTable tbody"); //Tbody - Cuerpo de la tabla
    const form = document.getElementById("categoryForm"); // Formulario dentro del modal
    const modal = new bootstrap.Modal(document.getElementById("categoryModal")); //Modal
    const lblModal = document.getElementById("categoryModalLabel");// Titulo del modal 
    const btnAdd = document.getElementById("btnAddCategory");//Boton para abrir modal

    init(); //Este metodo permite cargar las categorias en la tabla 
    btnAdd.addEventListener("click", ()=>{
        form.reset();
        form.categoryId.value = "";
        lblModal.textContent = "Agregar categoria"
        modal.show();
    });

    form.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const id = form.categoryId.value; //obtenemos id 
        const data = {
            nombreCategoria: form.categoryName.value.trim(),
            descripcion: form.categoryDescription.value.trim()
        };

        try{
        if(id){
            await updateCategory(id, data);
        }

        else{
            await createCategory(data);
        }
        modal.hide();
        await loadCategories(); 
    }
    catch(err){
        console.error("Error: ",err);
    }

    });

    async function loadCategories() {
        try{
            const categories = await getCategories();
            tablebody.innerHTML = ""; //Vaciamos la tabla 

            if(!categories || categories.length == 0){
                tablebody.innerHTML = '<td colspan="5">Actualmente no hay registros</td>';
                return;
            }

            categories.forEach((cat)=>{
                const tr = document.createElement("tr"); //Se crea el elemento con js
                tr.innerHTML = `
                    <td>${cat.idCategoria}</td>
                    <td>${cat.nombreCategoria}</td>
                    <td>${cat.descripcion || ""}</td>
                    <td>${cat.fechaCreacion || ""}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary edit-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-square-pen">
                            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                            </svg>
                        </button>

                        <button class="btn btn-sm btn-outline-danger delete-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-trash">
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                        <path d="M3 6h18"/>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        </button>
                    </td>
                `;

                //Funcionalidad para botones de Editar
                tr.querySelector(".edit-btn").addEventListener("click", ()=>{
                    form.categoryId.value = cat.idCategoria;
                    form.categoryName.value = cat.nombreCategoria;
                    form.categoryDescription.value = cat.descripcion;
                    lblModal.textContent = "Editar Categoria";

                    //El modal se hasta que el formulario ya tenga los datos cargados
                    modal.show();
                });

                //Funcionalidad para botones eliminar
                tr.querySelector(".delete-btn").addEventListener("click", ()=>{
                    if(confirm("Desea eliminar esta categoria")){
                        deleteCategory(cat.idCategoria).then(loadCategories);
                    }
                });

                tablebody.appendChild(tr); //Al TBODY se le concatena la nueva fila creada
            });
        }
        catch(err){
            console.error("Error cargando categorias: ", err);
        }
    }

    function init(){
        loadCategories();
    }

}); //Esto no se toca ahi termina el evento

