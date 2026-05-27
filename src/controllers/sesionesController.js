 // src/controllers/sesionesController.js 
 // AGREGAR al inicio del archivo (después de la primera línea):
const { pub } = require('../redis/client');
  // Contiene la lógica de negocio para las sesiones de estudio 
  // Por ahora usa un arreglo en memoria — el Paso 11 lo migra a Supabase 
   
  let sesiones = [];     // Base de datos temporal en memoria 
  let nextId   = 1;      // Contador autoincrementable de IDs 
   
  // ── GET /api/sesiones 

  // Devuelve todas las sesiones disponibles 
  const listar = async (req, res) => { 
    res.json({ 
      ok: true, 
      total: sesiones.length, 
      datos: sesiones 
    }); 
  }; 
   
  // ── GET /api/sesiones/:id 

  // Devuelve UNA sesión buscando por su ID 
  const obtenerUna = async (req, res) => { 
    const id = parseInt(req.params.id); // Convertir string a número 
    const sesion = sesiones.find(s => s.id === id); 
   
    if (!sesion) { 
      // 404 = Not Found: el recurso no existe 
      return res.status(404).json({ error: `Sesión ${id} no encontrada` }); 
    } 
   
    res.json(sesion); 
  }; 
   
  // ── POST /api/sesiones 

  // Crea una nueva sesión con los datos del body 
  const crear = async (req, res) => {
    const { titulo, descripcion, fechaHora, materia } = req.body;

    if (!titulo || titulo.trim() === '') {
        return res.status(400).json({ error: 'El campo titulo es obligatorio' });
    }

    const nuevaSesion = {
        id: nextId++,
        titulo: titulo.trim(),
        descripcion: descripcion || '',
        materia: materia || 'General',
        fechaHora: fechaHora || new Date().toISOString(),
        completada: false,
        creadaEn: new Date().toISOString()
    };

    sesiones.push(nuevaSesion);

    // ✨ NUEVO: publicar evento en Redis DESPUÉS de guardar la sesión
    await pub.publish('study:sesion:creada', JSON.stringify({
        tipo: 'sesion:creada',
        payload: nuevaSesion,
        timestamp: new Date().toISOString()
    }));
    console.log('[Redis] Evento publicado: sesion:creada ->', nuevaSesion.titulo);

    res.status(201).json(nuevaSesion);
};
   
  // ── PUT /api/sesiones/:id 

  // Actualiza una sesión existente (reemplaza todos sus campos) 
  const actualizar = async (req, res) => { 
    const id = parseInt(req.params.id); 
    const indice = sesiones.findIndex(s => s.id === id); 
   
    if (indice === -1) { 
      return res.status(404).json({ error: `Sesión ${id} no encontrada` }); 
    } 
   
    // Conservar el id original y la fecha de creación, actualizar el resto 
    sesiones[indice] = { 
      ...sesiones[indice],   // Campos originales 
      ...req.body,           // Nuevos valores del body 
      id: id,                // El ID nunca cambia 
      actualizadaEn: new Date().toISOString() 
    }; 
   
    res.json(sesiones[indice]); 
  }; 
   
  // ── DELETE /api/sesiones/:id 
 
  // Elimina una sesión del arreglo 
  const eliminar = async (req, res) => { 
    const id = parseInt(req.params.id); 
    const longitudAnterior = sesiones.length; 
   
    sesiones = sesiones.filter(s => s.id !== id); 
   
    if (sesiones.length === longitudAnterior) { 
      return res.status(404).json({ error: `Sesión ${id} no encontrada` }); 
    } 
   
    res.json({ ok: true, mensaje: `Sesión ${id} eliminada correctamente` }); 
  }; 
   
  module.exports = { listar, obtenerUna, crear, actualizar, eliminar }; 