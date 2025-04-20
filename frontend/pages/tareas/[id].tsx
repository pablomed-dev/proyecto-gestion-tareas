import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

type Tarea = {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  fecha_limite?: string; // por si también quieres mostrarla
};


export default function DetalleTarea({ tarea }: { tarea: Tarea }) {
  const router = useRouter();

  
  const estadoLabels: Record<string, { text: string; color: string; emoji: string }> = {
    pendiente:    { text: "Pendiente",    color: "text-yellow-600 dark:text-yellow-400", emoji: "⏳" },
    en_progreso:  { text: "En progreso",  color: "text-blue-600 dark:text-blue-400",     emoji: "🔄" },
    completada:   { text: "Completada",   color: "text-green-600 dark:text-green-400",   emoji: "✅" },
  };

  const estado = estadoLabels[tarea.estado] || { text: "Desconocido", color: "text-gray-600", emoji: "" };


  if (!tarea) return <div className="p-6 text-center text-gray-500 dark:text-gray-300">No se encontró la tarea</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-md mt-6">
    
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
        Detalles de la Tarea
      </h1>

      <div className="space-y-4 text-gray-700 dark:text-gray-200">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Título</p>
          <p className="text-lg font-semibold">{tarea.titulo}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Descripción</p>
          <p>{tarea.descripcion}</p>
        </div>

        {tarea.fecha_limite && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fecha límite</p>
            <p>{new Date(tarea.fecha_limite).toLocaleDateString()}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
          <p>
            <span className={`${estado.color} font-medium`}>
              {estado.text} {estado.emoji}
            </span>
          </p>
        </div>


        <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-between mt-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Volver
          </button>
          
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestion_de_tareas/${id}/`);
  const tarea = await res.json();

  return {
    props: {
      tarea,
    },
  };
};
