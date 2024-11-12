import { api_url } from "./urls";
import { getSession } from "next-auth/react";

function jsonResponse(error: boolean, message: string, data: Array<object>) {
  return { error, message, data };
}

async function getUserToken() {
  const session = await getSession();
  const token = session?.user.token;
  return token;
}

// --------------------------------- API call for roles CRUD ---------------------------------
export const getScreensModules = async () => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + "/api/screens_modules", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los módulos, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const addRol = async (data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + "/api/add_rol", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data[0] }),
    });

    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al agregar el rol, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getRoles = async () => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + "/api/roles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los módulos, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const deleteRol = async (rolId: number | null, data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + `/api/delete_rol`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rol_id: rolId,
        ...data[0],
      }),
    });
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al eliminar el rol, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getRolById = async (rolId: number | null) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + `/api/get_rol_by_id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rol_id: rolId,
      }),
    });
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los módulos, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const updateRol = async (rolId: number | null, data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + `/api/update_rol`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data[0], rol_id: rolId }),
    });
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al actualizar el rol, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

// --------------------------------- API call for users CRUD ---------------------------------
export const getUsers = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los usuarios, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getSAIs = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/sais", {
      headers: {
        Authorization: `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*'
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los SAIs, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getStatus = async () => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + "/api/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los status, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const addUser = async (data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + "/api/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data[0] }),
    });

    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al agregar el usuario, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const deleteUser = async (uId: number | null, data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + `/api/delete_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: uId,
        ...data[0],
      }),
    });
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al eliminar el usuario, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getUserById = async (uId: number | null) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + `/api/get_user_by_id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: uId,
      }),
    });
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar el usuario, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const updateUser = async (uId: number | null, data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + `/api/update_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data[0], user_id: uId }),
    });
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al actualizar el usuario, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const signOutUser = async (username: string) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + `/api/signOut`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cerrar sesión, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

// --------------------------------- API call for SAI ---------------------------------
export const getProvinces = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/provinces", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar las provincias, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getMunicipalities = async (provinceId: number) => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + `/api/municipalities/${provinceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los municipios, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const addSAI = async (data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + "/api/add_sai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data[0] }),
    });

    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al agregar el SAI, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const deleteSai = async (data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + `/api/delete_sai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data[0],
      }),
    });
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al eliminar el SAI, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getSaiById = async (saiId: number) => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + `/api/get_sai_by_id/${saiId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar el SAI, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const updateSai = async (saiId: number | null, data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + `/api/update_sai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data[0], sai_id: saiId }),
    });
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al actualizar el SAI, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

// --------------------------------- API call for Activity logs ---------------------------------
export const getActivityLogs = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/activity_logs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los registros de auditoría, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

// --------------------------------- API call for community operations ---------------------------------
export const getShifts = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/shifts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar las tandas, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getCommunityOperationTypes = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/community_operation_types", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los tipos de operativos, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getMunicipalityPlaces = async (municipalityId: number) => {
  try {
    const token = await getUserToken();

    const res = await fetch(
      api_url + `/api/municipality_places/${municipalityId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los barrios/parajes, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const addCommunityOperation = async (data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + "/api/add_community_operation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data[0] }),
    });

    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al agregar operativo comunidad, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getCommunityOperationsBySai = async (sai_id: number) => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/get_community_operations_by_sai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sai_id,
      }),
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los operativos comunidad de este SAI, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getAllMunicipalities = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/municipalities", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar todos los municipios, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getAllMunicipalityPlaces = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/municipality_places", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    throw Error(
      "Hubo un error al cargar todos los barrios/parajes, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte"
    );
  }
};

export const updateCommunityOperation = async (data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + `/api/update_community_operation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data[0] }),
    });
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al actualizar el SAI, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const deleteCommunityOperation = async (data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + `/api/delete_community_operation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data[0],
      }),
    });
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al eliminar el Operativo Comunidad, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

// --------------------------------- API call for community operations users ---------------------------------
export const getReferralTypes = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/referral_types", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    throw Error(
      "Hubo un error al cargar todos los tipos de referimientos, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte"
    );
  }
};

export const getGenres = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/genres", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    throw Error(
      "Hubo un error al cargar los géneros, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte"
    );
  }
};

export const getYesNo = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/yes_no", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    throw Error(
      "Hubo un error al cargar las confirmaciones (Si o No), verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte"
    );
  }
};

export const getNationalities = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/nationalities", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    throw Error(
      "Hubo un error al cargar las nacionalidades, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte"
    );
  }
};

export const getSerologyStatus = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/serology_status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    throw Error(
      "Hubo un error al cargar los estados serológicos, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte"
    );
  }
};

export const addCommunityOperationUser = async (data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + "/api/add_community_operation_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data[0] }),
    });

    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al agregar el usuario al operativo comunidad, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getCommunityOperationUsersBySaiAndOerationId = async (
  sai_id: number,
  operation_id: number
) => {
  try {
    const token = await getUserToken();

    const res = await fetch(
      api_url + "/api/get_community_operation_users_by_sai_and_operation_id",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sai_id,
          operation_id,
        }),
      }
    );
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los operativos comunidad del usuario, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const updateCommunityOperationUser = async (data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + `/api/update_community_operation_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data[0] }),
    });
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al actualizar el usuario de este operativo comunidad, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const deleteCommunityOperationUser = async (data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + `/api/delete_community_operation_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data[0],
      }),
    });
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al eliminar el Usuario de este Operativo Comunidad, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getAllCommunityOperationUsers = async (
  sai_id: number,
  rol_id: number
) => {
  try {
    const token = await getUserToken();

    const res = await fetch(
      api_url + "/api/get_all_community_operation_users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sai_id,
          rol_id,
        }),
      }
    );
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar todos los usuarios de los operativos comunidad, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

// --------------------------------- API call for community operations user profile ---------------------------------
export const getCommunityOperationUserDetails = async (
  sai_id: number,
  rol_id: number,
  community_operation_user_id: number
) => {
  try {
    const token = await getUserToken();

    const res = await fetch(
      api_url + "/api/get_community_operation_user_details",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sai_id,
          rol_id,
          community_operation_user_id,
        }),
      }
    );
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los detalles del usuarios, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getEnrollingTypes = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/enrolling_types", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    throw Error(
      "Hubo un error al cargar los tipos de enrolamientos, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte"
    );
  }
};

export const addCommunityOperationUserTracking = async (
  data: Array<object>
) => {
  try {
    const token = await getUserToken();
    const res = await fetch(
      api_url + "/api/add_community_operation_user_tracking",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data[0] }),
      }
    );

    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al agregar el seguimiento a este usuario, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const addCommunityOperationUserEnrolling = async (
  data: Array<object>
) => {
  try {
    const token = await getUserToken();
    const res = await fetch(
      api_url + "/api/add_community_operation_user_enrolling",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data[0] }),
      }
    );

    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al enrolar a este usuario, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getFappsIdById = async (fapps_id: number) => {
  try {
    const token = await getUserToken();

    const res = await fetch(
      api_url +
        `/api/check_community_operation_user_enrolling_fapps_id/${fapps_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar el ID FAPPS, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getCommunityOperationUserTrackingsById = async (
  user_id: number
) => {
  try {
    const token = await getUserToken();

    const res = await fetch(
      api_url + `/api/get_user_community_operation_user_trackings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id }),
      }
    );
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los seguimientos de este usuario, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const deleteCommunityOperationUserTracking = async (
  data: Array<object>
) => {
  try {
    const token = await getUserToken();
    const res = await fetch(
      api_url + `/api/delete_community_operation_user_tracking`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data[0],
        }),
      }
    );
    const resJson = await res.json();

    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al eliminar el seguimiento de este usuario, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getCommunityOperationUserEnrollingsById = async (
  user_id: number
) => {
  try {
    const token = await getUserToken();

    const res = await fetch(
      api_url + `/api/get_user_community_operation_user_enrollings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id }),
      }
    );
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar la situación de enrolamiento del usuario, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

// --------------------------------- API call for patients ---------------------------------
export const getFappsIdByPatientId = async (fapps_id: number) => {
  try {
    const token = await getUserToken();

    const res = await fetch(
      api_url + `/api/check_patient_fapps_id/${fapps_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar el ID FAPPS, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const addPatient = async (data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + "/api/add_community_operation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data[0] }),
    });

    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al agregar operativo comunidad, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

// --------------------------------- API call for participant inscriptions form ---------------------------------
export const getUniqueNumber = async (uniqueNumber: number) => {
  try {
    const token = await getUserToken();

    const res = await fetch(
      api_url + `/api/check_participant_unique_number/${uniqueNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar el número único, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const addParticipantInscriptionForm = async (data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + "/api/add_participant_inscription_form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data[0] }),
    });

    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al agregar formulario de inscripción de participantes, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

//-----------------------------------------FOR ADMIN----------------------------------------------
export const getCommunityOperations = async () => {
  try {
    const token = await getUserToken();

    const res = await fetch(api_url + "/api/get_community_operations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los operativos de comunidad, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getCommunityOperationUsersByOperationId = async (
  operation_id: number
) => {
  try {
    const token = await getUserToken();

    const res = await fetch(
      api_url + "/api/get_community_operation_users_by_operation_id",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          operation_id,
        }),
      }
    );
    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al cargar los usuarios de este operativo comunidad, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const signInAsAnotherUser = async (data: Array<object>) => {
  try {
    const token = await getUserToken();
    const res = await fetch(api_url + "/api/sign_in_as", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data[0] }),
    });

    const resJson = await res.json();
    // I don't call jsonResponse here becouse the structure of res it's the same
    return resJson;
  } catch (error) {
    return jsonResponse(
      true,
      "Hubo un error al iniciar sesión como otro usuario, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};
