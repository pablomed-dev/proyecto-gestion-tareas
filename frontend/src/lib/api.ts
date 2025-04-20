const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function fetchTareas(){
    const res = await fetch(`${API_URL}/gestion_de_tareas/`);
    if (!res.ok) throw new Error("Error al obtener las tareas");
    return res.json();
}

export async function eliminarTarea(id: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestion_de_tareas/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar la tarea");
  }
  