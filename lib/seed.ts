import { api_url } from "./urls";

function jsonResponse(error: boolean, message: string, data: Array<object>) {
  return { error, message, data };
}

// API call for roles and screens CRUD
export const getScreensModules = async () => {
  try {
    const res = await fetch(api_url + "/api/screens_modules");
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
    const res = await fetch(api_url + "/api/add_rol", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    const res = await fetch(api_url + "/api/roles");
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

export const deleteRol = async (rolId: number | null) => {
  try {
    const res = await fetch(api_url + `/api/delete_rol`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      "Hubo un error al eliminar el rol, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getRolById = async (rolId: number | null) => {
  try {
    const res = await fetch(api_url + `/api/get_rol_by_id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    const res = await fetch(api_url + `/api/update_rol`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

// API call for users and roles CRUD
export const getUsers = async () => {
  try {
    const res = await fetch(api_url + "/api/users");
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
    const res = await fetch(api_url + "/api/sais");
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
    const res = await fetch(api_url + "/api/status");
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
    const res = await fetch(api_url + "/api/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

export const deleteUser = async (uId: number | null) => {
  try {
    const res = await fetch(api_url + `/api/delete_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      "Hubo un error al eliminar el usuario, verififique su conexion a internet e intente de nuevo, si el problema persiste comuníquese con soporte",
      []
    );
  }
};

export const getUserById = async (uId: number | null) => {
  try {
    const res = await fetch(api_url + `/api/get_user_by_id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    const res = await fetch(api_url + `/api/update_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
