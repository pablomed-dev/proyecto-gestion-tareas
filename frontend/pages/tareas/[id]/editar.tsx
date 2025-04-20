import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

type Tarea = {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_limite: string;
  estado: "pendiente" | "en_progreso" | "completada";
};

export default function EditarTarea({ tarea }: { tarea: Tarea }) {
  const [titulo, setTitulo] = useState(tarea.titulo);
  const [descripcion, setDescripcion] = useState(tarea.descripcion);
  const [fechaLimite, setFechaLimite] = useState(tarea.fecha_limite);
  const [estado, setEstado] = useState<Tarea["estado"]>(tarea.estado);

  const router = useRouter();

  const actualizarTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestion_de_tareas/${tarea.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descripcion, fecha_limite: fechaLimite, estado }),
    });
    router.push("/");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Editar tarea</h1>
      <form onSubmit={actualizarTarea} className="space-y-6 bg-white shadow-xl rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
          <input
            type="date"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as Tarea["estado"])}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En progreso</option>
            <option value="completada">Completada</option>
          </select>
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
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestion_de_tareas/${params?.id}/`);
  const tarea = await res.json();

  return { props: { tarea } };
};
