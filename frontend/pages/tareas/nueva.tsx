import { useState } from "react";
import { useRouter } from "next/router";

export default function NuevaTarea() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const router = useRouter();

  const crearTarea = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestion_de_tareas/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        descripcion,
        fecha_limite: fechaLimite,
        completado: false,
      }),
    });

    router.push("/");
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-md mt-6">
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
        Crear Nueva Tarea
      </h1>

      <form onSubmit={crearTarea} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Título
          </label>
          <input
            type="text"
            placeholder="Título de la tarea"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Descripción
          </label>
          <textarea
            placeholder="Describe la tarea"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Fecha límite
          </label>
          <input
            type="date"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-between mt-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Volver
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow-md transition-all"
          >
            Crear
          </button>
        </div>
      </form>
    </div>
  );
}
