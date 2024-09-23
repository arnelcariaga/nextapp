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