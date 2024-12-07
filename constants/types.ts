// Tipo para la colección "Empresas"
export type Empresa = {
    experienciaContratacion: {
      empleadosContratadosUltimos2Anios: string;
      rolesContratadosRecientemente: string[];
      satisfaccionContratacionesRecientes: number;
    };
    requisitosHabilidadesTecnicas: {
      habilidadesEsenciales: string[];
      herramientasTecnologias: string[];
    };
    preferenciasLaborales: {
      modalidadTrabajo: string;
      rangoSalarial: number;
      tipoEmpleo: string;
    };
    idiomas: {
      idiomasRequeridos: string[];
      nivelIdiomas: {
        [key: string]: string; // Ej: { "Inglés": "Avanzado", "Español": "Intermedio" }
      };
    };
    perfilEmpresa: {
      industria: string;
      tamanoEmpresa: string;
      valores: string;
    };
  };
  
  // Tipo para la colección "Candidatos"
  export type Candidato = {
    experienciaLaboral: {
      aniosExperiencia: string;
      ultimoCargo: string;
      industriaTrabajada: string;
      gestionEquipos: string;
    };
    habilidadesTecnicas: {
      habilidadesFuertes: string[];
      herramientasDominadas: string[];
    };
    preferenciasLaborales: {
      modalidadTrabajoPreferida: string;
      expectativaSalarial: number;
      dispuestoAMudarse: string;
    };
    idiomas: {
      idiomasHablados: {
        [key: string]: string; // Ej: { "Inglés": "Avanzado", "Español": "Intermedio" }
      };
    };
    formacionAcademica: {
      nivelEducativo: string;
      certificaciones: string[];
    };
  };
  
  // Tipo para la colección "Puestos"
  export type Puesto = {
    empresaID: string;
    tituloPuesto: string;
    descripcion: string;
    requisitos: {
      aniosExperiencia: string;
      habilidades: string[];
      idiomasRequeridos: string[];
    };
    modalidadTrabajo: string;
    rangoSalarial: number;
    tipoEmpleo: string;
    estado: string; // Ej: "Abierto", "Cerrado"
    candidatos: Array<{
      candidatoID: string;
      nombre: string;
      estado: string; // Ej: "Preseleccionado", "Contratado", "Rechazado"
      fechaSeleccion: string;
    }>;
  };