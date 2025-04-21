import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { eliminarTarea } from "@/lib/api";
import { useState } from "react";

type Tarea = {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  fecha_limite?: string;
};

// Función para formatear fecha en formato local
function formatearFecha(fechaIso: string): string {
  if (!fechaIso) return "";
  return new Date(fechaIso).toLocaleDateString();
}

export default function DetalleTarea({ tarea }: { tarea: Tarea }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const estadoLabels: Record<string, { text: string; color: string; bgColor: string; emoji: string }> = {
    pendiente: { 
      text: "Pendiente", 
      color: "text-yellow-800 dark:text-yellow-300", 
      bgColor: "bg-yellow-100 dark:bg-yellow-900/50", 
      emoji: "⏳" 
    },
    en_progreso: { 
      text: "En progreso", 
      color: "text-blue-800 dark:text-blue-300", 
      bgColor: "bg-blue-100 dark:bg-blue-900/50", 
      emoji: "🔄" 
    },
    completada: { 
      text: "Completada", 
      color: "text-green-800 dark:text-green-300", 
      bgColor: "bg-green-100 dark:bg-green-900/50", 
      emoji: "✅" 
    },
  };
  
  // Normalizar el estado para manejar tanto "en_progreso" como "en progreso"
  const estadoNormalizado = tarea.estado.replace(" ", "_").toLowerCase();
  const estadoInfo = estadoLabels[estadoNormalizado] || { 
    text: tarea.estado, 
    color: "text-gray-800 dark:text-gray-300", 
    bgColor: "bg-gray-100 dark:bg-gray-700", 
    emoji: "📝" 
  };

  const handleEliminar = async () => {
    if (confirm("¿Estás seguro que deseas eliminar esta tarea?")) {
      setIsLoading(true);
      try {
        await eliminarTarea(tarea.id);
        router.push("/");
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        alert("Ocurrió un error al eliminar la tarea");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!tarea) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="p-8 text-center text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-xl font-medium">No se encontró la tarea</h3>
        <p className="mt-1">La tarea que buscas no existe o ha sido eliminada</p>
        <Link href="/">
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Volver al inicio
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        {/* Cabecera con fondo de color */}
        <div className="relative mb-6 overflow-hidden rounded-t-xl bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="absolute top-4 right-4">
            <button
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              onClick={() => document.documentElement.classList.toggle("dark")}
              aria-label="Cambiar tema"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
          </div>
          
          <div className="pt-16 pb-8 px-6 md:px-10">
            <div className="flex items-center">
              <div className="mr-4 w-12 h-12 flex items-center justify-center rounded-full bg-white text-blue-600 dark:bg-blue-900 dark:text-blue-100 shadow-md">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Detalles de la Tarea</h1>
            </div>
            
            <div className="mt-4 flex items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${estadoInfo.bgColor} ${estadoInfo.color}`}>
                {estadoInfo.emoji} {estadoInfo.text}
              </span>
              
              {tarea.fecha_limite && (
                <span className="ml-3 inline-flex items-center text-white/90">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatearFecha(tarea.fecha_limite)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Tarjeta principal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Título */}
              <div>
                <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1">Título</h2>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{tarea.titulo}</p>
              </div>
              
              {/* Descripción */}
              <div>
                <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1">Descripción</h2>
                <div className="prose prose-blue dark:prose-invert dark:text-gray-300 max-w-none">
                  <p className="whitespace-pre-line">{tarea.descripcion || "Sin descripción."}</p>
                </div>
              </div>
              
              {/* Acciones */}
              <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <Link 
                    href="/"
                    className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Volver
                  </Link>
                  
                  <div className="flex gap-3">
                    <Link
                      href={`/tareas/${tarea.id}/editar`}
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors flex-1 sm:flex-none"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </Link>
                    
                    <button
                      onClick={handleEliminar}
                      disabled={isLoading}
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestion_de_tareas/${id}/`);
    
    if (!res.ok) {
      return {
        props: {
          tarea: null
        }
      };
    }
    
    const tarea = await res.json();
    
    return {
      props: {
        tarea,
      },
    };
  } catch (error) {
    console.error("Error fetching tarea:", error);
    return {
      props: {
        tarea: null
      }
    };
  }
};