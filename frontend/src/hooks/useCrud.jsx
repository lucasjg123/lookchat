import { useState, useCallback } from 'react';

export function useCrud(baseUrl, token) {
  const [items, setItems] = useState([]);

  // Func principal q se comunica con el backend
  const apiFetch = useCallback(async (url, options = {}) => {
    // console.log('req a url:', url);
    // Verificar si el body es FormData (para manejar archivos)
    const isFormData = options.body instanceof FormData;

    const res = await fetch(url, {
      ...options, // totalmente custom para agregar body y demás
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }), // Si es FormData, no establecer Content-Type
        ...options.headers, // headers adicionales que pueda pasar el usuario
      },
    });
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`Error ${res.status}`);
    }

    return res.json();
  }, []);

  // Obtener todos los artículos
  const getAll = useCallback(async () => {
    const data = await apiFetch(baseUrl, { method: 'GET' });
    if (data) setItems(data);
    console.log('articulos:', data);
  }, [apiFetch, baseUrl]);

  const getByPath = useCallback(
    async (subPath) => {
      const url = `${baseUrl}/${subPath}`;
      const data = await apiFetch(url, { method: 'GET' });
      setItems(data);
      return data;
    },
    [apiFetch, baseUrl]
  );

  // Crear un artículo
  const create = useCallback(
    async (item) => {
      // Paso 1: Crear el registro
      const createdItem = await apiFetch(baseUrl, {
        method: 'POST',
        body: JSON.stringify(item),
      });

      return createdItem; // ⬅⬅⬅ esto faltaba
    },
    [apiFetch, baseUrl]
  );

  // Actualizar un artículo
  const update = useCallback(
    async (id, item) => {
      if (item.imagen) {
        console.log('quiere actualizar imagen');
        const archivo = item.imagen;
        delete item.imagen;
        // eliminar luego volver a subir ya q al tener el mismo filename id pueden tener dif formato .jpg ejm
        // Si ya tiene una imagen, la borrarmos
        console.log('print del item', item);
        if (item.url !== undefined) {
          console.log('hola quiero borrar la imagen vieja');
          await deleteFile(item.url);
        }
        // Subimos la imagen nueva
        const img = await uploadFile(archivo, id);
        item = { ...item, url: img.url };
      } // guardar la url de la imgaen en el articulo
      await apiFetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(item),
      });
      await getAll();
    },
    [apiFetch, baseUrl, getAll]
  );

  // Eliminar un artículo
  const remove = useCallback(
    async (id, url) => {
      // eliminamos el articulo
      await apiFetch(`${baseUrl}/${id}`, { method: 'DELETE' });
      // eliminamos la imagen
      if (url !== undefined) await deleteFile(url);

      await getAll();
    },
    [apiFetch, baseUrl, getAll]
  );

  // Devolvemos los artículos y las funciones CRUD
  return { items, getAll, getByPath, create, update, remove };
}
