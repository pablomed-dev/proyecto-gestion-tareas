import { GetServerSideProps } from "next";
import Link from "next/link";
import { eliminarTarea } from "@/lib/api";

type Tarea = {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_limite?: string
  estado: string
  //completado: boolean;
};

//función para formatear fecha
function formatearFecha( fechaIso: string): string {
  if (!fechaIso) return;
  const fecha = new Date(fechaIso);
  const dia = String(fecha.getDate()).padStart(2,"0");
  const mes = String(fecha.getMonth() + 1).padStart(2,"0");
  const anio = fecha.getFullYear();
  return `${dia}-${mes}-${anio}`;
}

export default function Home({ tareas }: { tareas: Tarea[] }) {
  return (
    
    <div className="p-4 sm:p-6 max-w-full sm:max-w-2xl lg:max-w-4xl mx-auto my-4 border rounded shadow-2xl bg-white text-black dark:bg-gray-800 dark:text-white">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-black dark:text-white rounded"
        onClick={() => {
          document.documentElement.classList.toggle('dark');
        }}
      >
        🌗
      </button>

      <h1 className="text-3xl font-bold mb-6">📋 Lista de tareas</h1>

      <Link href="/tareas/nueva">
      <button className="w-full sm:w-auto mb-4 px-4 py-2 bg-blue-600 text-white rounded">
          Nueva tarea
        </button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 list-none">
      {/*<ul className="space-y-4">*/}
        {tareas.map((tarea) => (
          <li key={tarea.id} className="border p-4 rounded shadow bg-white dark:bg-gray-700 dark:text-white">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <h2 className="text-xl font-semibold">{tarea.titulo}</h2>
            </div>
            <p className="text-gray-600 dark:text-white mb-2">{tarea.descripcion}</p>
            <p className="text-sm text-gray-500 dark:text-white capitalize">{tarea.estado}</p>
            {formatearFecha(tarea.fecha_limite) && (
              <p className="text-sm text-gray-400 dark:text-white">
                Fecha límite: {formatearFecha(tarea.fecha_limite)}
              </p>
            )}
            
            
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Link
                href={`/tareas/${tarea.id}`}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm text-center w-full sm:w-auto"
              >
                Ver detalle
              </Link>

              <Link
                href={`/tareas/${tarea.id}/editar`}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm text-center w-full sm:w-auto"
              >
                Editar
              </Link>

              <button
                className="px-3 py-1 bg-red-500 text-white rounded text-sm w-full sm:w-auto"
                onClick={async () => {
                  if (confirm("¿Estás seguro que deseas eliminar esta tarea?")) {
                    await eliminarTarea(tarea.id);
                    location.reload();
                  }
                }}
              >
                Eliminar
              </button>
            </div>

          </li>
        ))}
      {/*</ul>*/}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestion_de_tareas/`);
  const tareas = await res.json();

  return {
    props: {
      tareas,
    },
  };
};


/*import { GetServerSideProps } from "next";
import { fetchTareas } from '@/lib/api'

type Tarea = {
  id: number
  titulo: string
  descripcion?: string
  fecha_limite?: string
  estado: string
  completado : boolean
}

type Props = {
  tareas: Tarea[]
}

export default function Home({ tareas }: Props) {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Lista de Tareas</h1>
      <ul className="space-y-4">
        {tareas.map(tarea => (
          <li key={tarea.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{tarea.titulo}</h2>
            <p className="text-sm text-gray-600">{tarea.descripcion}</p>
            <p className="text-sm text-gray-500">{tarea.estado}</p>
            {tarea.fecha_limite && (
              <p className="text-sm text-gray-400">
                Fecha límite: {tarea.fecha_limite}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tareas = await fetchTareas()
  return {
    props: { tareas },
  }
}
  */

/*import Link from "next/link";
import Layout from "../components/Layout";


const IndexPage = () => (
  <Layout title="Sistema de gestión de tareas">
    <h1>Bienvenido al sistema de gestión de tareas 👋</h1>
    <p>
      <Link href="/about">About</Link>
    </p>
    <div className="bg-blue-500 text-white p-4 rounded-xl">
      ¡Tailwind está funcionando!
    </div>
  </Layout>
);

export default IndexPage;
*/
