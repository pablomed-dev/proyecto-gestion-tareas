
import { GetServerSideProps } from "next";
import Link from "next/link";
import { eliminarTarea } from "@/lib/api";
import { useState, useEffect, useRef } from "react";
import moment from 'moment';
import NotificationBadge from 'components/NotificationBadge';
import Head from 'next/head';

type Tarea = {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_limite?: string;
  estado: string;
};

// Función para formatear fecha usando moment
function formatearFecha(fechaIso: string): string {
  if (!fechaIso) return "";
  
  // Configurar idioma español
  moment.locale('es');
  
  return moment(fechaIso).format('DD-MM-YYYY');
}

// Función para obtener color basado en estado
function getEstadoColor(estado: string): string {
  switch (estado.toLowerCase()) {
    case "pendiente":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "en progreso":
    case "en_progreso":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "completada":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
}

export default function Home({ tareas: initialTareas }: { tareas: Tarea[] }) {
  // Estados
  const [tareas, setTareas] = useState<Array<Tarea & { favorito?: boolean; eliminada?: boolean }>>(
    initialTareas.map(t => ({ ...t, favorito: false, eliminada: false }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTareas, setFilteredTareas] = useState(tareas);
  const [activeFilter, setActiveFilter] = useState("todas"); // todas, favoritas, papelera
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Referencias para drag & drop
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Efecto para cargar preferencias del localStorage al inicio
  useEffect(() => {
    // Cargar tema
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    
    // Cargar favoritos
    try {
      const savedFavorites = JSON.parse(localStorage.getItem("tareasFavoritas") || "[]");
      const savedTrash = JSON.parse(localStorage.getItem("tareasPapelera") || "[]");
      
      // Aplicar a las tareas
      const updatedTareas = initialTareas.map(tarea => ({
        ...tarea,
        favorito: savedFavorites.includes(tarea.id),
        eliminada: savedTrash.includes(tarea.id)
      }));
      
      setTareas(updatedTareas);
      applyFilters(updatedTareas, "todas", "");
    } catch (error) {
      console.error("Error al cargar datos del localStorage:", error);
    }
  }, [initialTareas]);

  // Función para aplicar filtros
  const applyFilters = (items: Array<Tarea & { favorito?: boolean; eliminada?: boolean }>, filter: string, term: string) => {
    let results = [...items];
    
    // Aplicar filtro de categoría
    if (filter === "favoritas") {
      results = results.filter(tarea => tarea.favorito && !tarea.eliminada);
    } else if (filter === "papelera") {
      results = results.filter(tarea => tarea.eliminada);
    } else {
      // "todas" - excluir las eliminadas
      results = results.filter(tarea => !tarea.eliminada);
    }
    
    // Aplicar filtro de búsqueda
    if (term) {
      results = results.filter(tarea => 
        tarea.titulo.toLowerCase().includes(term.toLowerCase()) || 
        tarea.descripcion.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    setFilteredTareas(results);
  };

  // Manejador de búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(tareas, activeFilter, term);
  };
  
  // Manejador de cambio de filtro
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    applyFilters(tareas, filter, searchTerm);
  };

  // Funciones para drag & drop
  const handleDragStart = (position: number) => {
    dragItem.current = position;
  };
  
  const handleDragEnter = (position: number) => {
    dragOverItem.current = position;
  };
  
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      // Crear copia del array para no modificar el estado directamente
      const items = [...filteredTareas];
      const draggedItem = items[dragItem.current];
      
      // Reordenar
      items.splice(dragItem.current, 1);
      items.splice(dragOverItem.current, 0, draggedItem);
      
      // Actualizar estado
      setFilteredTareas(items);
      
      // Modificar array original también
      const newTareas = [...tareas];
      const tareaIndex = newTareas.findIndex(t => t.id === draggedItem.id);
      if (tareaIndex !== -1) {
        const item = newTareas[tareaIndex];
        newTareas.splice(tareaIndex, 1);
        const targetIndex = newTareas.findIndex(t => t.id === items[dragOverItem.current === 0 ? 0 : dragOverItem.current - 1]?.id) + 1;
        newTareas.splice(targetIndex !== 0 ? targetIndex : 0, 0, item);
        setTareas(newTareas);
      }
    }
    
    // Resetear referencias
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Función para cambiar tema
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  // Función para marcar favorito
  const toggleFavorito = (id: number) => {
    const newTareas = tareas.map(tarea => {
      if (tarea.id === id) {
        return { ...tarea, favorito: !tarea.favorito };
      }
      return tarea;
    });
    
    setTareas(newTareas);
    applyFilters(newTareas, activeFilter, searchTerm);
    
    // Guardar en localStorage
    const favoritos = newTareas
      .filter(t => t.favorito)
      .map(t => t.id);
    localStorage.setItem("tareasFavoritas", JSON.stringify(favoritos));
  };
  
  // Función para mover a papelera
  const moverAPapelera = (id: number) => {
    const newTareas = tareas.map(tarea => {
      if (tarea.id === id) {
        return { ...tarea, eliminada: true };
      }
      return tarea;
    });
    
    setTareas(newTareas);
    applyFilters(newTareas, activeFilter, searchTerm);
    
    // Guardar en localStorage
    const papelera = newTareas
      .filter(t => t.eliminada)
      .map(t => t.id);
    localStorage.setItem("tareasPapelera", JSON.stringify(papelera));
  };
  
  // Función para restaurar de papelera
  const restaurarDePapelera = (id: number) => {
    const newTareas = tareas.map(tarea => {
      if (tarea.id === id) {
        return { ...tarea, eliminada: false };
      }
      return tarea;
    });
    
    setTareas(newTareas);
    applyFilters(newTareas, activeFilter, searchTerm);
    
    // Guardar en localStorage
    const papelera = newTareas
      .filter(t => t.eliminada)
      .map(t => t.id);
    localStorage.setItem("tareasPapelera", JSON.stringify(papelera));
  };
  
  // Función para vaciar papelera
  const vaciarPapelera = async () => {
    // Obtener ids de elementos en papelera
    const enPapelera = tareas.filter(t => t.eliminada).map(t => t.id);
    
    // Eliminar del servidor
    for (const id of enPapelera) {
      try {
        await eliminarTarea(id);
      } catch (error) {
        console.error(`Error al eliminar tarea ${id}:`, error);
      }
    }
    
    // Quitar de nuestro estado
    const newTareas = tareas.filter(t => !t.eliminada);
    setTareas(newTareas);
    
    // Limpiar localStorage
    localStorage.setItem("tareasPapelera", "[]");
    
    // Actualizar la vista
    applyFilters(newTareas, activeFilter, searchTerm);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Head>
        <title>Gestión de Tareas</title>
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
              <span className="mr-3">📋</span> Sistema de Gestión de Tareas
            </h1>
            <button
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={toggleDarkMode}
              aria-label="Cambiar tema"
            >
              {isDarkMode ? (
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          {/* Filtros */}
          <div className="px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-6 overflow-x-auto pb-4 pt-2">
              <button
                className={`relative flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeFilter === "todas"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleFilterChange("todas")}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 18V9h4v9H4zm6-9h4v9h-4V9z" />
                  </svg>
                  Todas
                </span>
                
                <NotificationBadge 
                  count={tareas.filter(t => !t.eliminada).length} 
                  color={activeFilter === "todas" ? "bg-blue-600" : "bg-gray-500 dark:bg-gray-600"} 
                />
              </button>
              
              <button
                className={`relative flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeFilter === "favoritas"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleFilterChange("favoritas")}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Favoritas
                </span>
                
                <NotificationBadge 
                  count={tareas.filter(t => t.favorito && !t.eliminada).length} 
                  color={activeFilter === "favoritas" ? "bg-yellow-600" : "bg-yellow-500"} 
                />
              </button>
              
              <button
                className={`relative flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeFilter === "papelera"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleFilterChange("papelera")}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Papelera
                </span>
                
                <NotificationBadge 
                  count={tareas.filter(t => t.eliminada).length} 
                  color={activeFilter === "papelera" ? "bg-red-600" : "bg-red-500"} 
                  className={tareas.filter(t => t.eliminada).length > 0 ? "animate-pulse" : ""}
                />
              </button>
            </div>
          </div>

          {/* Barra de acciones */}
          <div className="p-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {activeFilter !== "papelera" ? (
              <Link href="/tareas/nueva">
                <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Nueva tarea
                  </span>
                </button>
              </Link>
            ) : (
              filteredTareas.length > 0 && (
                <button 
                  onClick={() => {
                    if (confirm("¿Estás seguro de vaciar la papelera? Esta acción eliminará permanentemente todas las tareas.")) {
                      vaciarPapelera();
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none"
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Vaciar papelera
                  </span>
                </button>
              )
            )}
            
            <div className="relative w-full sm:w-64 md:w-96">
              <input
                type="text"
                placeholder={`Buscar en ${activeFilter === "todas" ? "tareas" : activeFilter}...`}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                value={searchTerm}
                onChange={handleSearch}
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-6">
            {filteredTareas.length === 0 ? (
              <div className="text-center py-10">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                  {activeFilter === "papelera" 
                    ? "La papelera está vacía" 
                    : activeFilter === "favoritas" 
                      ? "No tienes tareas favoritas" 
                      : "No hay tareas"}
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {searchTerm 
                    ? "No se encontraron tareas con ese término" 
                    : activeFilter === "papelera" 
                      ? "Las tareas que elimines aparecerán aquí" 
                      : activeFilter === "favoritas" 
                        ? "Marca tus tareas como favoritas para verlas aquí" 
                        : "Comienza creando una nueva tarea"}
                </p>
                {searchTerm && (
                  <button 
                    className="mt-4 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => {
                      setSearchTerm("");
                      applyFilters(tareas, activeFilter, "");
                    }}
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTareas.map((tarea, index) => (
                  <div 
                    key={tarea.id} 
                    className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden hover:shadow-lg transition-all ${
                      dragItem.current === index ? "opacity-50" : ""
                    } ${tarea.favorito && !tarea.eliminada ? "ring-2 ring-yellow-400" : ""}`}
                    draggable={activeFilter !== "papelera"}
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex-1">{tarea.titulo}</h2>
                        
                        {!tarea.eliminada && (
                          <button 
                            onClick={() => toggleFavorito(tarea.id)}
                            className="ml-2 text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400 transition-colors"
                            aria-label={tarea.favorito ? "Quitar de favoritos" : "Añadir a favoritos"}
                          >
                            {tarea.favorito ? (
                              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            )}
                          </button>
                        )}
                        
                        <span className={`ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full ${getEstadoColor(tarea.estado)}`}>
                          {tarea.estado}
                        </span>
                      </div>
                      
                      <div className="border-b border-gray-200 dark:border-gray-700 my-3"></div>
                      
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                        {tarea.descripcion?.length > 100 
                          ? tarea.descripcion.substring(0, 100) + "..." 
                          : tarea.descripcion || "Sin descripción"}
                      </p>
                      
                      {tarea.fecha_limite && (
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          Fecha límite: {formatearFecha(tarea.fecha_limite)}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {tarea.eliminada ? (
                          <>
                            <button
                              className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                              onClick={() => restaurarDePapelera(tarea.id)}
                            >
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                              </svg>
                              Restaurar
                            </button>
                            <button
                              className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                              onClick={async () => {
                                if (confirm("¿Estás seguro de eliminar esta tarea permanentemente? Esta acción no se puede deshacer.")) {
                                  await eliminarTarea(tarea.id);
                                  
                                  // Actualizar estado
                                  const newTareas = tareas.filter(t => t.id !== tarea.id);
                                  setTareas(newTareas);
                                  
                                  // Actualizar papelera en localStorage
                                  const papelera = JSON.parse(localStorage.getItem("tareasPapelera") || "[]");
                                  const nuevaPapelera = papelera.filter((id: number) => id !== tarea.id);
                                  localStorage.setItem("tareasPapelera", JSON.stringify(nuevaPapelera));
                                  
                                  // Recargar vista
                                  applyFilters(newTareas, activeFilter, searchTerm);
                                }
                              }}
                            >
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Eliminar
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/tareas/${tarea.id}`}
                              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                            >
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              Ver
                            </Link>
                            
                            <Link
                              href={`/tareas/${tarea.id}/editar`}
                              className="flex-1 flex items-center justify-center px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-md transition-colors"
                            >
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              Editar
                            </Link>
                            
                            <button
                              className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors"
                              onClick={() => moverAPapelera(tarea.id)}
                            >
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              Sistema de Gestión de Tareas © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestion_de_tareas/`);
    
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    
    const tareas = await res.json();
    
    return {
      props: {
        tareas,
      },
    };
  } catch (error) {
    console.error("Error fetching tareas:", error);
    
    return {
      props: {
        tareas: [],
      },
    };
  }
};